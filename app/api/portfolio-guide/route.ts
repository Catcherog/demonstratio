import { randomUUID } from "node:crypto";
import type { GuideEvent, GuideRequest, PortfolioEvidence } from "@/content/portfolio-evidence";
import { portfolioEvidence } from "@/content/portfolio-evidence";
import {
  classifyMessage,
  createRateLimiter,
  resolveGuideResponse,
  validateGuideRequest,
} from "@/lib/portfolio-guide/core.mjs";

export const runtime = "nodejs";

const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });
const encoder = new TextEncoder();

function ndjson(events: GuideEvent[], status = 200) {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        if (event.type === "delta") await new Promise((resolve) => setTimeout(resolve, 18));
      }
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

function errorResponse(
  code: "INVALID_INPUT" | "OUT_OF_SCOPE" | "UPSTREAM_UNAVAILABLE",
  message: string,
  status = 400,
) {
  return ndjson([{ type: "error", code, message }], status);
}

function chunkText(text: string, size = 32) {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += size) chunks.push(text.slice(index, index + size));
  return chunks;
}

function sourceContext(source: PortfolioEvidence) {
  return {
    id: source.id,
    project: source.projectSlug,
    title: source.title,
    summary: source.summary,
    status: source.status,
  };
}

async function callPortfolioModel({
  request,
  sources,
}: {
  request: Pick<GuideRequest, "role" | "message"> & { history?: GuideRequest["history"] };
  sources: PortfolioEvidence[];
}) {
  const baseUrl = process.env.PORTFOLIO_GUIDE_API_BASE_URL?.trim();
  const apiKey = process.env.PORTFOLIO_GUIDE_API_KEY?.trim();
  const model = process.env.PORTFOLIO_GUIDE_MODEL?.trim();
  if (!baseUrl || !apiKey || !model) throw new Error("guide upstream unavailable");

  const roleIntent = {
    recruiter: "优先帮助招聘官快速理解职责、产品判断、交付状态与岗位相关证据。",
    "product-lead": "优先解释问题定义、关键取舍、协作方式、路线图与业务边界。",
    technical: "优先解释系统架构、可靠性、数据流、降级、测试语义与工程边界。",
  }[request.role];

  const system = [
    "你是陈嘉伟作品集的只读导览助手。",
    roleIntent,
    "只能基于给定公开证据回答，不得补充未提供的指标、公司结论或实现状态。",
    "不得替招聘方作录用判断，不得声称执行了任何外部写入。",
    "资料不足时直接说明，并建议查看对应案例。用自然、克制的中文回答。",
  ].join("\n");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 450,
        stream: false,
        messages: [
          { role: "system", content: system },
          ...(request.history ?? []).map((item) => ({ role: item.role, content: item.content })),
          {
            role: "user",
            content: `公开证据:\n${JSON.stringify(sources.map(sourceContext))}\n\n问题:${request.message}`,
          },
        ],
      }),
    });
    if (!response.ok) throw new Error("guide upstream unavailable");
    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("guide upstream unavailable");
    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwarded || request.headers.get("x-real-ip") || "local";
  if (!limiter.check(clientKey).allowed) {
    return errorResponse("INVALID_INPUT", "请求稍快了，请一分钟后再试。", 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("INVALID_INPUT", "请求格式无效。");
  }

  const validation = validateGuideRequest(payload);
  if (!validation.ok) return errorResponse(validation.error.code, validation.error.message);

  const scope = classifyMessage(validation.value.message);
  if (scope !== "portfolio") {
    const message = scope === "injection"
      ? "我不会读取或披露内部提示、密钥与未公开资料。你可以继续询问作品集案例和公开证据。"
      : "这个窗口只回答作品集、项目能力与公开证据相关问题。";
    return errorResponse("OUT_OF_SCOPE", message, 422);
  }

  const hasUpstream = Boolean(
    process.env.PORTFOLIO_GUIDE_API_BASE_URL &&
    process.env.PORTFOLIO_GUIDE_API_KEY &&
    process.env.PORTFOLIO_GUIDE_MODEL,
  );
  const result = await resolveGuideResponse(
    validation.value,
    portfolioEvidence,
    hasUpstream ? (context) => callPortfolioModel({ ...context, request: validation.value }) : undefined,
  );
  const requestId = randomUUID();

  const events: GuideEvent[] = [
    { type: "meta", mode: result.mode, requestId },
    ...chunkText(result.text).map((text) => ({ type: "delta", text } as const)),
    {
      type: "sources",
      items: result.sources.map((source) => ({
        evidenceId: source.id,
        title: source.title,
        projectSlug: source.projectSlug,
        href: `/projects/${source.projectSlug}`,
        status: source.status,
      })),
    },
    { type: "done" },
  ];
  return ndjson(events);
}
