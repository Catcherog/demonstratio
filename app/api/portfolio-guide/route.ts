import {
  contextForSources,
  retrievePortfolioSources,
  roleInstruction,
  staticPortfolioAnswer,
  type GuideRole,
  type PortfolioSource,
} from "@/lib/portfolio-guide";
import {
  resolveConfig,
  uniqueModels,
  isLegacyKeySource,
} from "@/lib/portfolio-ai/config";
import { callVolcengineArk, type ChatMessage } from "@/lib/portfolio-ai/providers/volcengine-ark";
import { fallbackNote, type PortfolioAiError } from "@/lib/portfolio-ai/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

const ALLOWED_ROLES = new Set<GuideRole>(["recruiter", "product-lead", "technical"]);
const MAX_QUESTION_LENGTH = 600;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_CONTENT = 1_200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const encoder = new TextEncoder();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "anonymous";
}

function isRateLimited(request: Request, limit: number): boolean {
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
11. 当用户询问"这个 AI 导览、作品集助手或官网机器人"时，必须依据"作品集 AI 导览"证据回答，并明确它与 Studio Customer Service 的区别。
12. 不得声称作品集 AI 导览使用 LangGraph、ChromaDB、Embedding 或向量数据库；当前实现是代码事实源上的关键词、别名与规则排序。
13. 导览没有长期记忆、工具调用或外部写入能力；多轮历史仅限当前请求携带的最近 6 条消息。
14. 当项目资料存在运行边界时，必须同时说明已验证能力和当前未闭合部分。

公开证据上下文：
${context}`;
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

/** Structured log entry for provider diagnostics. Never includes API key. */
function logProviderEvent(
  event: string,
  details: {
    provider: string;
    model: string;
    mode?: StreamMode;
    errorCode?: PortfolioAiError["code"];
    httpStatus?: number;
    requestId?: string;
    durationMs?: number;
    fallbackTriggered?: boolean;
    legacyKey?: boolean;
    attemptedModels?: string[];
    failureSummary?: Array<{ model: string; code: PortfolioAiError["code"]; httpStatus?: number }>;
  },
) {
  console.warn(`[portfolio-guide] ${event}`, details);
}

export async function POST(request: Request): Promise<Response> {
  const config = resolveConfig();

  if (isRateLimited(request, config.rateLimit)) {
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

  const sources = retrievePortfolioSources(message, role, 8, history);
  const context = contextForSources(sources);
  const modelCandidates = uniqueModels(config.model, config.fallbackModels);
  const legacyKey = isLegacyKeySource();

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
            promptVersion: config.promptVersion,
            knowledgeVersion: config.knowledgeVersion,
          }),
        );
      };

      controller.enqueue(ndjson({ type: "sources", items: sourcePayload(sources) }));

      if (!config.disabled && config.apiKey) {
        const failures: Array<{ model: string; error: PortfolioAiError; durationMs: number }> = [];
        let lastError: PortfolioAiError | undefined;

        for (const [index, modelId] of modelCandidates.entries()) {
          let emitted = false;

          sendMeta(
            "live",
            modelId,
            index === 0
              ? undefined
              : `主模型不可用，已切换到 ${modelId}`,
          );

          const result = await callVolcengineArk({
            apiKey: config.apiKey,
            baseUrl: config.baseUrl,
            model: modelId,
            system: systemPrompt(role, context),
            history: history as ChatMessage[],
            message,
            maxOutputTokens: config.maxOutputTokens,
            temperature: config.temperature,
            timeoutMs: config.timeoutMs,
            requestSignal: request.signal,
            onText(text) {
              emitted = true;
              controller.enqueue(ndjson({ type: "delta", text }));
            },
          });

          if (result.error) {
            lastError = result.error;
            failures.push({ model: modelId, error: result.error, durationMs: result.durationMs });

            logProviderEvent("model_call_failed", {
              provider: config.provider,
              model: modelId,
              errorCode: result.error.code,
              httpStatus: result.error.httpStatus,
              requestId: result.error.requestId,
              durationMs: result.durationMs,
              fallbackTriggered: index < modelCandidates.length - 1,
              legacyKey,
            });
          }

          if (emitted) {
            if (result.error) {
              // If we already emitted partial output and the upstream timed out,
              // keep the partial output rather than showing an error to the user.
              // The partial answer is more useful than replacing it with offline fallback.
              // For non-timeout errors (e.g. invalid response), still surface the error.
              if (result.error.code === "UPSTREAM_TIMEOUT") {
                logProviderEvent("stream_partial_output_on_timeout", {
                  provider: config.provider,
                  model: modelId,
                  errorCode: result.error.code,
                  durationMs: result.durationMs,
                  legacyKey,
                });
                controller.close();
                return;
              }

              logProviderEvent("stream_interrupted_after_partial_output", {
                provider: config.provider,
                model: modelId,
                errorCode: result.error.code,
                durationMs: result.durationMs,
                legacyKey,
              });
              controller.enqueue(ndjson({ type: "error", message: "AI 回答传输中断，请重新提问。" }));
              controller.close();
              return;
            }

            controller.close();
            return;
          }

          if (request.signal.aborted) {
            controller.close();
            return;
          }
        }

        logProviderEvent("all_models_failed_using_fallback", {
          provider: config.provider,
          model: config.model,
          mode: "fallback",
          attemptedModels: modelCandidates,
          failureSummary: failures.map((f) => ({
            model: f.model,
            code: f.error.code,
            httpStatus: f.error.httpStatus,
          })),
          legacyKey,
        });

        sendMeta("fallback", undefined, fallbackNote(lastError));
      } else if (config.disabled) {
        sendMeta("guided", undefined, "AI 生成已关闭，当前使用离线证据导览。");
      } else {
        logProviderEvent("api_key_missing_using_guided", {
          provider: config.provider,
          model: config.model,
          mode: "guided",
          legacyKey,
        });
        sendMeta("guided", undefined, "实时模型尚未配置，当前使用离线证据导览。");
      }

      const fallback = staticPortfolioAnswer(message, role, sources, history);
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
