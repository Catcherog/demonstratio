import {
  contextForSources,
  retrievePortfolioSources,
  roleInstruction,
  staticPortfolioAnswer,
  type GuideRole,
  type PortfolioSource,
} from "@/lib/portfolio-guide";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type GuideRequest = {
  role?: GuideRole;
  message?: string;
  history?: HistoryMessage[];
};

type StreamMode = "live" | "guided" | "fallback";

type ZhipuStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string;
      reasoning_content?: string;
    };
    finish_reason?: string | null;
  }>;
  error?: {
    code?: string | number;
    message?: string;
  };
};

const ALLOWED_ROLES = new Set<GuideRole>(["recruiter", "product-lead", "technical"]);
const MAX_QUESTION_LENGTH = 600;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_CONTENT = 1_200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_ZHIPU_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
const DEFAULT_MODEL = "glm-5.2";
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const encoder = new TextEncoder();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "anonymous";
}

function isRateLimited(request: Request): boolean {
  const limit = Math.max(1, Number.parseInt(process.env.PORTFOLIO_AI_RATE_LIMIT ?? "12", 10) || 12);
  const now = Date.now();
  const key = clientKey(request);
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    current.count += 1;
    if (current.count > limit) return true;
  }

  if (rateBuckets.size > 1_000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
    }
  }

  return false;
}

function ndjson(value: unknown): Uint8Array {
  return encoder.encode(`${JSON.stringify(value)}\n`);
}

function splitForStreaming(text: string, chunkSize = 36): string[] {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }
  return chunks;
}

function parseFallbackModels(): string[] {
  return (process.env.PORTFOLIO_AI_FALLBACK_MODELS ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function uniqueModels(primary: string, fallbacks: string[]): string[] {
  return [...new Set([primary, ...fallbacks])];
}

function boundedInteger(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function boundedTemperature(value: string | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  if (!Number.isFinite(parsed)) return 0.2;
  return Math.min(1, Math.max(0, parsed));
}

function zhipuApiKey(): string | undefined {
  return process.env.ZHIPU_API_KEY?.trim() || process.env.GLM_API_KEY?.trim() || undefined;
}

function zhipuBaseURL(): string {
  return (process.env.ZHIPU_BASE_URL?.trim() || DEFAULT_ZHIPU_BASE_URL).replace(/\/+$/, "");
}

function sanitizeHistory(history: unknown): HistoryMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_MESSAGES)
    .filter(
      (item): item is HistoryMessage =>
        Boolean(
          item &&
            typeof item === "object" &&
            (item as HistoryMessage).role &&
            ["user", "assistant"].includes((item as HistoryMessage).role) &&
            typeof (item as HistoryMessage).content === "string",
        ),
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_HISTORY_CONTENT),
    }))
    .filter((item) => item.content.length > 0);
}

function sourcePayload(sources: PortfolioSource[]) {
  return sources.map(({ score: _score, ...source }) => source);
}

function systemPrompt(role: GuideRole, context: string): string {
  return `你是陈嘉伟作品集官网中的 AI 导览助手。你的任务是帮助招聘官、产品负责人和技术面试官理解项目、决策、技术实现、本人贡献和当前边界。

${roleInstruction(role)}

必须遵守以下规则：
1. 只能依据下方“公开证据上下文”回答，不得补写未出现的经历、指标、客户、收入、生产效果或模型评测结果。
2. 明确区分：已验证、历史测试基线、Controlled Demo、进行中、计划中、DESIGNED_NOT_DEPLOYED。
3. 测试数量只能说明工程回归，不能解释为回答准确率；训练 loss 只能说明训练收敛，不能解释为业务质量。
4. 涉及多个项目时，先说明它们的角色差异和关系，再列共同能力。
5. 技术问题至少覆盖：数据流或工作流、关键组件、可靠性/降级、验证证据、未完成边界。
6. 产品问题至少覆盖：业务问题、关键判断、方案取舍、失败成本、下一步验证。
7. 回答使用中文，直接、具体、可面试追问。根据问题复杂度输出 300—900 字；简单问题可更短。
8. 推荐结构：结论 → 具体机制/案例 → 证据 → 当前边界。不要机械重复标题，也不要写空泛评价。
9. 可以在正文中用“【项目名｜章节】”标示依据，但不要伪造 URL 或证据编号。
10. 结尾最多给出 2 个有价值的追问方向，不要替招聘方作最终录用判断。

公开证据上下文：
${context}`;
}

function redactSecrets(text: string): string {
  return text
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{12,}/g, "[redacted]")
    .slice(0, 220);
}

function safeErrorReason(error: unknown): string {
  if (!(error instanceof Error)) return "unknown_model_error";
  return redactSecrets(error.message);
}

function upstreamErrorMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; code?: string | number }; message?: string };
    return redactSecrets(parsed.error?.message || parsed.message || raw);
  } catch {
    return redactSecrets(raw || "empty_upstream_error");
  }
}

async function streamZhipuModel(options: {
  apiKey: string;
  model: string;
  system: string;
  history: HistoryMessage[];
  message: string;
  maxOutputTokens: number;
  temperature: number;
  timeoutMs: number;
  requestSignal: AbortSignal;
  onText: (text: string) => void;
}): Promise<boolean> {
  const timeoutController = new AbortController();
  const relayAbort = () => timeoutController.abort(options.requestSignal.reason);
  const timeout = setTimeout(() => timeoutController.abort(new Error("zhipu_request_timeout")), options.timeoutMs);

  if (options.requestSignal.aborted) relayAbort();
  else options.requestSignal.addEventListener("abort", relayAbort, { once: true });

  try {
    const response = await fetch(`${zhipuBaseURL()}/chat/completions`, {
      method: "POST",
      signal: timeoutController.signal,
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: options.model,
        messages: [
          { role: "system", content: options.system },
          ...options.history,
          { role: "user", content: options.message },
        ],
        stream: true,
        max_tokens: options.maxOutputTokens,
        temperature: options.temperature,
      }),
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new Error(`Zhipu HTTP ${response.status}: ${upstreamErrorMessage(raw)}`);
    }
    if (!response.body) throw new Error("智谱接口没有返回流式响应体");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let emitted = false;
    let streamDone = false;

    const consumeLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(":")) return;
      if (!trimmed.startsWith("data:")) return;

      const payload = trimmed.slice(5).trim();
      if (!payload) return;
      if (payload === "[DONE]") {
        streamDone = true;
        return;
      }

      let chunk: ZhipuStreamChunk;
      try {
        chunk = JSON.parse(payload) as ZhipuStreamChunk;
      } catch {
        throw new Error("智谱流式响应包含无法解析的数据");
      }

      if (chunk.error) {
        throw new Error(`Zhipu stream error: ${redactSecrets(chunk.error.message || String(chunk.error.code || "unknown"))}`);
      }

      const text = chunk.choices?.[0]?.delta?.content;
      if (typeof text === "string" && text.length > 0) {
        emitted = true;
        options.onText(text);
      }
    };

    for (;;) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      let newline = buffer.indexOf("\n");
      while (newline >= 0) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        consumeLine(line);
        newline = buffer.indexOf("\n");
      }

      if (done || streamDone) break;
    }

    if (buffer.trim()) consumeLine(buffer);
    return emitted;
  } finally {
    clearTimeout(timeout);
    options.requestSignal.removeEventListener("abort", relayAbort);
  }
}

function errorResponse(message: string, status = 400): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(ndjson({ type: "error", message }));
      controller.close();
    },
  });

  return new Response(stream, {
    status,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (isRateLimited(request)) {
    return errorResponse("提问过于频繁，请稍后再试。", 429);
  }

  let payload: GuideRequest;

  try {
    payload = (await request.json()) as GuideRequest;
  } catch {
    return errorResponse("请求格式无效，请刷新页面后重试。", 400);
  }

  const role: GuideRole = payload.role && ALLOWED_ROLES.has(payload.role) ? payload.role : "recruiter";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const history = sanitizeHistory(payload.history);

  if (!message) return errorResponse("请输入一个具体问题。", 400);
  if (message.length > MAX_QUESTION_LENGTH) {
    return errorResponse(`问题最多 ${MAX_QUESTION_LENGTH} 个字符。`, 400);
  }

  const sources = retrievePortfolioSources(message, role, 8);
  const context = contextForSources(sources);
  const primaryModel = process.env.PORTFOLIO_AI_MODEL?.trim() || DEFAULT_MODEL;
  const modelCandidates = uniqueModels(primaryModel, parseFallbackModels());
  const apiKey = zhipuApiKey();
  const aiDisabled = process.env.PORTFOLIO_AI_DISABLED === "1";
  const maxOutputTokens = boundedInteger(process.env.PORTFOLIO_AI_MAX_OUTPUT_TOKENS, 1_600, 256, 4_096);
  const temperature = boundedTemperature(process.env.PORTFOLIO_AI_TEMPERATURE);
  const timeoutMs = boundedInteger(process.env.PORTFOLIO_AI_TIMEOUT_MS, 38_000, 5_000, 42_000);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const sendMeta = (mode: StreamMode, model?: string, note?: string) => {
        controller.enqueue(
          ndjson({
            type: "meta",
            mode,
            model,
            note,
            retrievedCount: sources.length,
            promptVersion: process.env.PORTFOLIO_AI_PROMPT_VERSION ?? "portfolio-guide-r1",
          }),
        );
      };

      controller.enqueue(ndjson({ type: "sources", items: sourcePayload(sources) }));

      if (!aiDisabled && apiKey) {
        const failures: Array<{ model: string; reason: string }> = [];

        for (const [index, modelId] of modelCandidates.entries()) {
          let emitted = false;

          try {
            sendMeta(
              "live",
              modelId,
              index === 0 ? "智谱开放平台直连" : `主模型不可用，已切换到 ${modelId}`,
            );

            const completedWithText = await streamZhipuModel({
              apiKey,
              model: modelId,
              system: systemPrompt(role, context),
              history,
              message,
              maxOutputTokens,
              temperature,
              timeoutMs,
              requestSignal: request.signal,
              onText(text) {
                emitted = true;
                controller.enqueue(ndjson({ type: "delta", text }));
              },
            });
            emitted = emitted || completedWithText;

            if (emitted) {
              controller.close();
              return;
            }

            throw new Error("模型没有返回可展示文本");
          } catch (error) {
            if (request.signal.aborted) {
              controller.close();
              return;
            }

            const reason = safeErrorReason(error);
            failures.push({ model: modelId, reason });

            if (emitted) {
              console.warn("[portfolio-guide] GLM stream interrupted after partial output", {
                model: modelId,
                reason,
              });
              controller.enqueue(ndjson({ type: "error", message: "AI 回答传输中断，请重新提问。" }));
              controller.close();
              return;
            }
          }
        }

        console.warn("[portfolio-guide] direct GLM generation failed; using evidence fallback", {
          attemptedModels: modelCandidates,
          failures,
        });
        sendMeta("fallback", undefined, "智谱模型服务暂时不可用，已切换到离线证据导览。");
      } else if (aiDisabled) {
        sendMeta("guided", undefined, "AI 生成已关闭，当前使用离线证据导览。");
      } else {
        console.warn("[portfolio-guide] ZHIPU_API_KEY is not configured; using evidence-only mode");
        sendMeta("guided", undefined, "实时模型尚未启用，当前使用离线证据导览。");
      }

      const fallback = staticPortfolioAnswer(message, role, sources);
      for (const chunk of splitForStreaming(fallback)) {
        if (request.signal.aborted) break;
        controller.enqueue(ndjson({ type: "delta", text: chunk }));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
