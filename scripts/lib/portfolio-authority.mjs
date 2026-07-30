import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const AUTHORITY_FILENAME = "01-PUBLIC-SOURCE-OF-TRUTH.yaml";

export function getAuthorityCandidates(cwd = process.cwd(), env = process.env) {
  const candidates = [];
  if (typeof env.PORTFOLIO_AUTHORITY_DIR === "string" && env.PORTFOLIO_AUTHORITY_DIR.trim()) {
    candidates.push(resolve(cwd, env.PORTFOLIO_AUTHORITY_DIR.trim()));
  }
  candidates.push(
    resolve(cwd, "../../../_portfolio_handoff/job-ready-r1.3"),
    resolve(cwd, "../../_portfolio_handoff/job-ready-r1.3"),
    resolve(cwd, "../_portfolio_handoff/job-ready-r1.3"),
  );
  return [...new Set(candidates)];
}

export function resolveAuthorityDir(cwd = process.cwd(), env = process.env) {
  const candidates = getAuthorityCandidates(cwd, env);
  const found = candidates.find((candidate) => existsSync(resolve(candidate, AUTHORITY_FILENAME)));
  if (found) return found;
  throw new Error(
    [
      `Unable to locate the exact job-ready-r1.3 authority package (${AUTHORITY_FILENAME}).`,
      "Set PORTFOLIO_AUTHORITY_DIR or place the package at one of:",
      ...candidates.map((candidate) => `- ${candidate}`),
    ].join("\n"),
  );
}

export function loadPublicAuthority(cwd = process.cwd(), env = process.env) {
  const authorityDir = resolveAuthorityDir(cwd, env);
  const authorityPath = resolve(authorityDir, AUTHORITY_FILENAME);
  const raw = readFileSync(authorityPath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Authority file must be JSON-compatible YAML: ${authorityPath}\n${detail}`);
  }
}

export function getMetricBindings(authority) {
  const bindings = Array.isArray(authority?.public_numeric_bindings)
    ? authority.public_numeric_bindings
    : [];
  return bindings.filter(
    (binding) =>
      binding &&
      typeof binding.id === "string" &&
      binding.metric_value !== undefined &&
      binding.metric_value !== null &&
      typeof binding.metric_label === "string" &&
      binding.metric_label.length > 0 &&
      typeof binding.evidence_ref === "string" &&
      binding.evidence_ref.length > 0,
  );
}
