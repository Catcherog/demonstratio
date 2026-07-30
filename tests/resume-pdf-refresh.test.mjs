import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function read(relativePath, encoding) {
  return readFile(new URL(relativePath, root), encoding);
}

test("English resume mirrors the approved two-page evidence set", async () => {
  const html = await read("scripts/resume/resume-two-page-en.html", "utf8");

  assert.equal((html.match(/<article class="page"/g) || []).length, 2);
  assert.match(html, /282 SKUs/);
  assert.match(html, /80\+ concurrent projects/);
  assert.match(html, /10 high-value prototypes/);
  assert.match(html, /typical order value of RMB 3,000\+/);
  assert.match(html, /589 Python \+ 55 Web regression tests/);
  assert.match(html, /90-scenario evaluation set/);
  assert.match(html, /10 production V2 Base tables and 216 fields/);
  assert.match(html, /32 targeted, 195 client, and 527 server regression tests/);
  assert.match(html, /2\/2 real text-to-image and image-to-image calls returned HTTP 200/);
  assert.match(html, /https:\/\/www\.jaelchen\.com/);
  assert.match(html, /https:\/\/github\.com\/Catcherog/);

  assert.doesNotMatch(html, /90%\+|92%|50%\+ automation|production accuracy/i);
});

test("website resume PDFs exist under the stable linked filenames", async () => {
  for (const relativePath of [
    "public/resume/chen-jiawei-ai-agent-cn-two-page.pdf",
    "public/resume/jiawei-chen-ai-agent-en.pdf",
  ]) {
    const pdf = await read(relativePath);
    assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.ok(pdf.length > 50_000, `${relativePath} is unexpectedly small`);
  }
});
