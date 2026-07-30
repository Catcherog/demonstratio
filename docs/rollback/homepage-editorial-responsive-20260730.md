# Homepage editorial-responsive rollback reference

## Protected baseline

- GitHub production baseline: `1c28d18882926271052ac0f926282a3c52f951e9`
- Local backup branch: `backup/homepage-before-editorial-responsive-20260730`
- Feature branch: `codex/homepage-editorial-responsive-20260730`
- Isolated worktree: `D:\360Downloads\Trae 项目\ZeH image\.worktrees\portfolio-ui-editorial-responsive`

## Read-only verification

```powershell
git -C "D:\360Downloads\Trae 项目\ZeH image\demonstratio" rev-parse backup/homepage-before-editorial-responsive-20260730
git -C "D:\360Downloads\Trae 项目\ZeH image\.worktrees\portfolio-ui-editorial-responsive" status --short
git -C "D:\360Downloads\Trae 项目\ZeH image\.worktrees\portfolio-ui-editorial-responsive" diff --stat
```

The backup branch must resolve to `1c28d18882926271052ac0f926282a3c52f951e9`.

## Non-destructive rollback options

1. Keep the current production alias unchanged and stop before deployment. No external rollback is then required.
2. Review the original version by opening the protected backup branch in a separate worktree.
3. If the feature is later committed and deployed, create a new rollback branch from the protected backup branch and deploy that branch through the normal reviewed release process.

Do not use `git reset --hard`, `git clean`, force-push, or delete another worktree to perform rollback.
