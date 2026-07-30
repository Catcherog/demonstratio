import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  AUTHORITY_FILENAME,
  getAuthorityCandidates,
  getMetricBindings,
  loadPublicAuthority,
  resolveAuthorityDir,
} from "../scripts/lib/portfolio-authority.mjs";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);

async function withFixture(authority, callback) {
  const base = await mkdtemp(join(tmpdir(), "portfolio-authority-"));
  const root = join(base, "repo", ".worktrees", "case");
  const fallback = resolve(root, "../../../_portfolio_handoff/job-ready-r1.3");
  const envDir = join(base, "private-authority");
  await mkdir(root, { recursive: true });
  await mkdir(fallback, { recursive: true });
  await mkdir(envDir, { recursive: true });
  await writeFile(join(fallback, AUTHORITY_FILENAME), JSON.stringify({ package: { id: "fallback" } }), "utf8");
  await writeFile(join(envDir, AUTHORITY_FILENAME), JSON.stringify(authority), "utf8");
  try {
    await callback({ root, envDir });
  } finally {
    await rm(base, { recursive: true, force: true });
  }
}

test("PORTFOLIO_AUTHORITY_DIR wins over all local fallbacks", async () => {
  const authority = {
    package: { id: "job-ready-r1.3", current_public_baseline: "R1.3" },
    public_numeric_bindings: [],
  };
  await withFixture(authority, ({ root, envDir }) => {
    const env = { PORTFOLIO_AUTHORITY_DIR: envDir };
    assert.equal(resolveAuthorityDir(root, env), envDir);
    assert.equal(getAuthorityCandidates(root, env)[0], envDir);
    assert.equal(loadPublicAuthority(root, env).package.id, "job-ready-r1.3");
  });
});

test("resolver error lists every checked absolute path", async () => {
  const base = await mkdtemp(join(tmpdir(), "portfolio-missing-authority-"));
  const cwd = join(base, "repo", ".worktrees", "case");
  await mkdir(cwd, { recursive: true });
  const candidates = getAuthorityCandidates(cwd, {});
  try {
    assert.throws(
      () => resolveAuthorityDir(cwd, {}),
      (error) => candidates.every((candidate) => error.message.includes(candidate)),
    );
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("metric bindings require exact value, label and evidence fields", () => {
  const authority = {
    public_numeric_bindings: [
      { id: "OK", metric_value: "10/10", metric_label: "生产 V2 表级匹配", evidence_ref: "E-FEISHU-LIVE-SCHEMA" },
      { id: "NO-VALUE", metric_label: "内部状态", evidence_ref: "E-PRIVATE" },
      { id: "NO-LABEL", metric_value: "2/2", evidence_ref: "E-PRIVATE" },
    ],
  };
  assert.deepEqual(getMetricBindings(authority).map((item) => item.id), ["OK"]);
});

test("repository manifest matches the exact R1.3 authority bindings", async () => {
  const authority = loadPublicAuthority(repoRoot, process.env);
  assert.equal(authority.package.id, "job-ready-r1.3");
  assert.equal(authority.package.current_public_baseline, "R1.3");
  const manifest = JSON.parse(await readFile(new URL("../content/public-claims.json", import.meta.url), "utf8"));
  const bindings = new Map(getMetricBindings(authority).map((binding) => [binding.id, binding]));
  assert.equal(manifest.length, 21);
  const expectedCounts = { hero: 4, "data-platform": 5, "service-agent": 7, "lumen-ink": 5 };
  const counts = {};
  for (const claim of manifest) {
    const binding = bindings.get(claim.claimId);
    assert.ok(binding, `missing authority binding: ${claim.claimId}`);
    assert.equal(claim.value, binding.metric_value, `value mismatch: ${claim.claimId}`);
    assert.equal(claim.label, binding.metric_label, `label mismatch: ${claim.claimId}`);
    assert.equal(claim.evidenceRef, binding.evidence_ref, `evidence mismatch: ${claim.claimId}`);
    counts[claim.surface] = (counts[claim.surface] ?? 0) + 1;
  }
  assert.deepEqual(counts, expectedCounts);
});

test("public metric manifest excludes report-only or misleading values", async () => {
  const manifest = await readFile(new URL("../content/public-claims.json", import.meta.url), "utf8");
  for (const forbidden of ["16/16", "3/3", "52/90", "589", "%"]) {
    assert.equal(manifest.includes(forbidden), false, `forbidden public metric: ${forbidden}`);
  }
  assert.doesNotMatch(manifest, /准确率\s*(?:为|=|:|：)?\s*\d/);
});
