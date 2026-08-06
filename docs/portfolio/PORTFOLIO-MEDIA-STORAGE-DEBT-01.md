# PORTFOLIO-MEDIA-STORAGE-DEBT-01

**Status: DEFERRED_NO_SAFE_STORAGE_TARGET**

Recorded: 2026-08-05
Task: PORTFOLIO-R2-POST-RELEASE-CLEANUP-01 (Task B)
Baseline: Production main merge SHA `5866f3b6`

## Summary

The Feishu write-proof video is committed directly to this Git repository at ~66 MB, which
exceeds GitHub's 50 MB recommended blob size. Forward migration to object storage was
evaluated and **deliberately not executed**, because no safe, already-provisioned storage
target exists for this project. The current asset remains in place and is serving correctly
in Production.

## Asset under debt

| Field | Value |
|---|---|
| Repo path | `public/evidence/data-platform/feishu-write-proof.mp4` |
| Size | 69,862,596 bytes (~66.6 MiB) |
| Blob SHA | `358bee7296c72f0634ca3eab089435c4bfa2a431` |
| Git LFS | Not tracked (`filter: unspecified`) |
| Production URL | https://jaelchen-portfolio-vercel-extracted.vercel.app/evidence/data-platform/feishu-write-proof.mp4 |
| Production Content-Type | `video/mp4` |
| Production Range support | `Accept-Ranges: bytes` |
| Production Content-Length | 69862596 |
| Referenced by | `content/portfolio-evidence.ts` → evidence id `data-platform-write-proof` (`kind: "video"`, `state: "available"`) |

The asset is publicly reachable, correctly typed, and seekable. **There is no active
production defect.** This is a repository-hygiene debt only.

## Storage targets evaluated

| Candidate | Configured in project? | Credentials available? | Verdict |
|---|---|---|---|
| Vercel Blob | No — `@vercel/blob` absent from `package.json` | No — `BLOB_READ_WRITE_TOKEN` unset | Not available |
| Tencent Cloud COS | No SDK, no config | No — `TENCENTCLOUD_SECRET_ID` / `COS_SECRET_ID` unset | Not available |
| CloudBase (TCB) | Referenced only as **narrative case text** for the separate 光砚 / Lumen application | No — `CLOUDBASE_ENV_ID` / `TCB_ENV_ID` unset | Not available; also cross-project coupling |
| AWS S3 / MinIO / OSS / Qiniu | No SDK, no config | No | Not available |
| Free public file hosts | — | — | **Explicitly rejected** — unstable hosting is out of scope per task constraints |

Supporting observations:

- `package.json` dependencies are limited to `ai`, `next`, `react`, `react-dom` plus dev
  tooling. No object-storage SDK is present.
- `.env.example` declares only `PORTFOLIO_AI_*` variables. No storage variables exist.
- `vercel`, `tcb`, and `cloudbase` command shims resolve on PATH but their packages are
  missing (`Cannot find module ...`), and no CLI authentication state is present.
- CloudBase mentions inside `content/flagship-cases/*.ts` and `.worktrees/**/docs/**` are
  documentation about the Lumen product, not infrastructure belonging to this portfolio site.

## Decision

Do not migrate. Keep `public/evidence/data-platform/feishu-write-proof.mp4` in the repository.

Rationale:

1. No pre-provisioned storage exists, so migration would require standing up a **new**
   platform — contrary to the "reuse existing storage, do not add unnecessary platforms"
   constraint.
2. Removing or re-pointing the asset without a verified replacement URL would risk breaking
   video playback in Production, which is a hard constraint.
3. Temporary free file hosting is explicitly disallowed.

## Constraints honoured

- `git lfs migrate --everything` — **not executed**
- Rebase / history rewrite on `main` — **not performed**
- Force push — **not performed**
- MP4 deletion before a verified external URL — **not performed**
- Production video playability — **unchanged and verified working**

## Exit criteria to resolve this debt

Resolve when **all** of the following hold:

1. A durable object-storage target is provisioned and owned by this project (Vercel Blob on
   the `catcher1` account is the lowest-friction option, since the site already deploys on
   Vercel).
2. Credentials are available to the deployment environment (e.g. `BLOB_READ_WRITE_TOKEN`
   present in Vercel project env).
3. The uploaded media URL is verified to be:
   - publicly or controllably reachable without a short-lived signed URL,
   - served as `Content-Type: video/mp4`,
   - `Accept-Ranges: bytes` (seekable),
   - stable across Production deployments.
4. `content/portfolio-evidence.ts` evidence `data-platform-write-proof` is re-pointed to the
   external URL, all gates pass (`lint`, `test`, `test:v5`, `test:cases`, `build`), and a
   Preview is verified **by response body** (not status code alone — Preview deployments on
   this project sit behind Vercel SSO and return HTTP 200 for the login page).
5. Only then: delete the in-repo MP4 from the current `HEAD` and add a `.gitignore` rule for
   large media. Note this removes the file going forward but does **not** purge it from Git
   history; history rewriting stays out of scope unless separately authorised.

## Notes

- Adding a `.gitignore` entry now was intentionally skipped: the tracked file would be
  unaffected (gitignore does not apply to already-tracked paths), and adding a rule while the
  asset must stay would misrepresent the repository's actual policy. The rule should land
  together with the deletion, in the same change that re-points the reference.
