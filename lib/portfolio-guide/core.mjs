const GUIDE_ROLES = new Set(["recruiter", "product-lead", "technical"]);
const HISTORY_ROLES = new Set(["user", "assistant"]);

const PORTFOLIO_TERMS = [
  "项目", "作品集", "岗位", "匹配", "能力", "agent", "ai", "rag", "飞书",
  "service", "lumen", "光砚", "架构", "治理", "交付", "技术", "产品", "风险",
  "证据", "经历", "负责", "取舍", "上线", "评估",
];

const INJECTION_PATTERNS = [
  /忽略.{0,12}(之前|以上|系统|指令|提示)/i,
  /system\s*prompt/i,
  /(?:(?:输出|泄露|查看|展示|告诉).{0,8}提示词|提示词.{0,8}(?:输出|泄露|查看|展示|告诉))/i,
  /developer\s*(message|instruction)/i,
  /越狱|jailbreak/i,
  /输出.{0,10}(密钥|api\s*key|环境变量)/i,
];

const LOCAL_PATH_PATTERN = /(?:[a-z]:\\|\/(?:users|home|var|private)\/)/i;

function invalid(message) {
  return { ok: false, error: { code: "INVALID_INPUT", message } };
}

export function validateGuideRequest(input) {
  if (!input || typeof input !== "object") return invalid("请求格式无效。");
  if (!GUIDE_ROLES.has(input.role)) return invalid("请选择有效的导览角色。");
  if (typeof input.message !== "string") return invalid("请输入想了解的问题。");

  const message = input.message.trim();
  if (message.length < 1 || message.length > 600) return invalid("问题长度需在 1–600 个字符之间。");

  const history = input.history ?? [];
  if (!Array.isArray(history) || history.length > 6) return invalid("最多保留 6 条历史消息。");

  const normalizedHistory = [];
  for (const item of history) {
    if (!item || typeof item !== "object" || !HISTORY_ROLES.has(item.role) || typeof item.content !== "string") {
      return invalid("历史消息格式无效。");
    }
    const content = item.content.trim();
    if (!content || content.length > 600) return invalid("历史消息长度无效。");
    normalizedHistory.push({ role: item.role, content });
  }

  return { ok: true, value: { role: input.role, message, history: normalizedHistory } };
}

export function classifyMessage(message) {
  const normalized = String(message ?? "").trim().toLowerCase();
  if (INJECTION_PATTERNS.some((pattern) => pattern.test(normalized))) return "injection";
  if (PORTFOLIO_TERMS.some((term) => normalized.includes(term))) return "portfolio";
  return "out-of-scope";
}

function containsLocalPath(value) {
  return LOCAL_PATH_PATTERN.test(JSON.stringify(value));
}

export function filterGuideEvidence(items) {
  return items.filter((item) => item && item.publicSafe === true && item.state === "available" && Array.isArray(item.evidenceRefs) && item.evidenceRefs.length > 0 && !containsLocalPath(item));
}

export function getRenderableEvidence(items, environment = "production") {
  if (environment === "production") return filterGuideEvidence(items);
  return items.filter((item) => {
    if (!item || item.state === "unavailable" || containsLocalPath(item)) return false;
    if (item.publicSafe !== true || !Array.isArray(item.evidenceRefs) || item.evidenceRefs.length === 0) return false;
    if (item.state === "planned") return !item.href && !item.assetUrl;
    return item.state === "available";
  });
}

function topicScore(message, item) {
  const normalized = message.toLowerCase();
  const terms = [...(item.tags ?? []), item.projectSlug, item.title, item.kind]
    .filter(Boolean)
    .map((term) => String(term).toLowerCase());
  return terms.reduce((score, term) => score + (normalized.includes(term) ? 8 : 0), 0);
}

export function retrieveEvidence(request, items, limit = 3) {
  return filterGuideEvidence(items)
    .map((item, index) => ({ item, index, score: topicScore(request.message, item) + Number(item.roleWeights?.[request.role] ?? 0) }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, Math.max(0, limit))
    .map(({ item }) => item);
}

export function buildGuidedAnswer(request, sources) {
  const roleLead = {
    recruiter: "先从岗位相关的产品判断、交付责任与可核验证据看起。",
    "product-lead": "先从问题定义、关键取舍与跨团队闭环看起。",
    technical: "先从系统边界、可靠性设计与工程证据看起。",
  }[request.role];

  if (sources.length === 0) {
    return `当前为导览模式。${roleLead}现有公开材料不足以回答这个问题，我不会据此推断或替代面试判断。你可以改问三个旗舰案例、Agent 风险边界或端到端交付。`;
  }

  const points = sources.map((source, index) => `${index + 1}. ${source.title}：${source.summary}`).join("\n");
  return `当前为导览模式。${roleLead}\n\n${points}\n\n以上只基于公开证据，不会替代面试判断；如需继续深挖，可以点开来源案例查看责任、边界与下一步。`;
}

export async function resolveGuideResponse(request, items, upstream) {
  const sources = retrieveEvidence(request, items, 3);
  if (typeof upstream === "function") {
    try {
      const text = String(await upstream({ request, sources })).trim();
      if (text) return { mode: "live", text, sources };
    } catch {
      // Guided mode intentionally hides upstream errors and remains usable.
    }
  }
  return { mode: "guided", text: buildGuidedAnswer(request, sources), sources };
}

export function createRateLimiter({ limit = 5, windowMs = 60_000 } = {}) {
  const buckets = new Map();
  return {
    check(key, now = Date.now()) {
      const current = buckets.get(key);
      if (!current || now - current.startedAt >= windowMs) {
        buckets.set(key, { count: 1, startedAt: now });
        return { allowed: true, remaining: limit - 1 };
      }
      if (current.count >= limit) return { allowed: false, remaining: 0 };
      current.count += 1;
      return { allowed: true, remaining: limit - current.count };
    },
  };
}
