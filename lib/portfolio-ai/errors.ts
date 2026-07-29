// Error classification for portfolio AI provider calls.
// Centralizes error categorization so the route can distinguish
// "missing key" from "upstream rejected" from "network timeout".

export type PortfolioAiErrorCode =
  | "API_KEY_MISSING"
  | "BASE_URL_INVALID"
  | "UPSTREAM_UNAUTHORIZED"
  | "UPSTREAM_FORBIDDEN"
  | "MODEL_NOT_FOUND"
  | "UPSTREAM_RATE_LIMITED"
  | "UPSTREAM_TIMEOUT"
  | "UPSTREAM_ABORTED"
  | "UPSTREAM_INVALID_RESPONSE"
  | "UPSTREAM_UNKNOWN";

export type PortfolioAiError = {
  code: PortfolioAiErrorCode;
  /** Redacted, safe for server logs. Never contains API keys or full tokens. */
  message: string;
  httpStatus?: number;
  requestId?: string;
};

/** Strip Bearer tokens, long opaque tokens, and truncate to a safe length. */
export function redactSecrets(text: string): string {
  return text
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{12,}/g, "[redacted]")
    .replace(/sk-[A-Za-z0-9]{8,}/gi, "[redacted]")
    .slice(0, 220);
}

/** Parse a JSON error body and return a redacted message. */
function parseUpstreamMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as {
      error?: { message?: string; code?: string | number };
      message?: string;
    };
    return redactSecrets(parsed.error?.message || parsed.message || raw);
  } catch {
    return redactSecrets(raw || "empty_upstream_error");
  }
}

/** Extract request ID from response headers (Volcengine Ark sends x-request-id). */
export function extractRequestId(response: Response): string | undefined {
  return (
    response.headers.get("x-request-id") ||
    response.headers.get("x-trace-id") ||
    response.headers.get("request-id") ||
    undefined
  );
}

/** Classify an HTTP error response into a structured error. */
export function classifyHttpError(
  status: number,
  body: string,
  requestId?: string,
): PortfolioAiError {
  const message = parseUpstreamMessage(body);
  switch (status) {
    case 401:
      return { code: "UPSTREAM_UNAUTHORIZED", message, httpStatus: status, requestId };
    case 403:
      return { code: "UPSTREAM_FORBIDDEN", message, httpStatus: status, requestId };
    case 404:
      return { code: "MODEL_NOT_FOUND", message, httpStatus: status, requestId };
    case 429:
      return { code: "UPSTREAM_RATE_LIMITED", message, httpStatus: status, requestId };
    default:
      return { code: "UPSTREAM_UNKNOWN", message, httpStatus: status, requestId };
  }
}

/** Classify a thrown error (network, timeout, abort, parse) into a structured error. */
export function classifyError(error: unknown): PortfolioAiError {
  if (!(error instanceof Error)) {
    return { code: "UPSTREAM_UNKNOWN", message: "non_error_throw" };
  }

  const name = error.name;
  const msg = error.message;

  if (name === "AbortError" || msg.includes("aborted")) {
    return { code: "UPSTREAM_ABORTED", message: "client_aborted" };
  }

  if (
    msg.includes("timeout") ||
    msg.includes("Timeout") ||
    msg.includes("timed out") ||
    msg.includes("ETIMEDOUT")
  ) {
    return { code: "UPSTREAM_TIMEOUT", message: "request_timed_out" };
  }

  if (msg.includes("invalid") && msg.includes("response")) {
    return { code: "UPSTREAM_INVALID_RESPONSE", message: redactSecrets(msg) };
  }

  return { code: "UPSTREAM_UNKNOWN", message: redactSecrets(msg) };
}

/**
 * Determine the user-facing note based on the error code.
 * Ensures we never blame "key not configured" when the real issue is upstream.
 */
export function fallbackNote(error: PortfolioAiError | undefined): string {
  if (!error) return "实时模型服务暂不可用，当前使用离线证据导览。";
  switch (error.code) {
    case "UPSTREAM_RATE_LIMITED":
      return "请求较多，请稍后再试。当前仍可查看项目证据。";
    case "UPSTREAM_TIMEOUT":
      return "实时模型响应超时，当前使用离线证据导览。";
    case "UPSTREAM_UNAUTHORIZED":
    case "UPSTREAM_FORBIDDEN":
    case "MODEL_NOT_FOUND":
    case "UPSTREAM_INVALID_RESPONSE":
    case "UPSTREAM_UNKNOWN":
      return "实时模型服务暂不可用，当前使用离线证据导览。";
    default:
      return "实时模型服务暂不可用，当前使用离线证据导览。";
  }
}
