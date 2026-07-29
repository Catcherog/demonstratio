// Volcengine Ark OpenAI-compatible adapter.
// Calls /chat/completions with streaming SSE, classifies errors,
// and never leaks API keys in logs or responses.

import {
  classifyError,
  classifyHttpError,
  extractRequestId,
  redactSecrets,
  type PortfolioAiError,
} from "@/lib/portfolio-ai/errors";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ArkAdapterOptions = {
  apiKey: string;
  baseUrl: string;
  model: string;
  system: string;
  history: ChatMessage[];
  message: string;
  maxOutputTokens: number;
  temperature: number;
  timeoutMs: number;
  requestSignal: AbortSignal;
  onText: (text: string) => void;
};

export type ArkAdapterResult = {
  emitted: boolean;
  error?: PortfolioAiError;
  durationMs: number;
  model: string;
};

type StreamChunk = {
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

/** Build the endpoint URL, ensuring no double slashes. */
function buildEndpoint(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/, "");
  return `${normalized}/chat/completions`;
}

/**
 * Call the Volcengine Ark OpenAI-compatible chat completions endpoint
 * with streaming SSE. Returns whether any text was emitted.
 *
 * Security:
 * - API key only in Authorization header, never logged
 * - Bearer token redacted in all error paths
 * - Upstream raw errors parsed and redacted before logging
 */
export async function callVolcengineArk(
  options: ArkAdapterOptions,
): Promise<ArkAdapterResult> {
  const startedAt = Date.now();
  const timeoutController = new AbortController();
  const relayAbort = () => timeoutController.abort(options.requestSignal.reason);
  const timeout = setTimeout(
    () => timeoutController.abort(new Error("ark_request_timeout")),
    options.timeoutMs,
  );

  if (options.requestSignal.aborted) relayAbort();
  else options.requestSignal.addEventListener("abort", relayAbort, { once: true });

  try {
    const endpoint = buildEndpoint(options.baseUrl);
    const response = await fetch(endpoint, {
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
      const raw = await response.text().catch(() => "");
      const requestId = extractRequestId(response);
      const error = classifyHttpError(response.status, raw, requestId);
      return {
        emitted: false,
        error,
        durationMs: Date.now() - startedAt,
        model: options.model,
      };
    }

    if (!response.body) {
      return {
        emitted: false,
        error: {
          code: "UPSTREAM_INVALID_RESPONSE",
          message: "ark_stream_body_missing",
        },
        durationMs: Date.now() - startedAt,
        model: options.model,
      };
    }

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

      let chunk: StreamChunk;
      try {
        chunk = JSON.parse(payload) as StreamChunk;
      } catch {
        throw new Error("ark_stream_parse_error: invalid JSON in SSE chunk");
      }

      if (chunk.error) {
        throw new Error(
          `ark_stream_error: ${redactSecrets(
            chunk.error.message || String(chunk.error.code || "unknown"),
          )}`,
        );
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

    return {
      emitted,
      durationMs: Date.now() - startedAt,
      model: options.model,
    };
  } catch (error) {
    if (options.requestSignal.aborted) {
      return {
        emitted: false,
        error: { code: "UPSTREAM_ABORTED", message: "client_aborted" },
        durationMs: Date.now() - startedAt,
        model: options.model,
      };
    }
    const classified = classifyError(error);
    return {
      emitted: false,
      error: classified,
      durationMs: Date.now() - startedAt,
      model: options.model,
    };
  } finally {
    clearTimeout(timeout);
    options.requestSignal.removeEventListener("abort", relayAbort);
  }
}
