# 光砚 Lumen — 60–90 秒演示脚本

## 主路径

1. 打开 `lumen-workbench`，说明工作台如何承载任务、Provider、参数和结果复核。
2. 打开 `lumen-provider-boundary`，解释 Provider adapter 把模型差异收敛为可替换的任务接口。
3. 用 `lumen-edit-verification` 只演示 Seedream 4.5 文生图与图生图两项真实验证，再说明结果回看与持久化边界。

## 失败处理

在线入口 `lumen-live-entry` 只是补充路径。若登录因 auth throttle 或 CloudBase 可达性返回 503，停留在已核验图片和 Provider 边界，不把在线入口说成全面可用。

## 允许说明

- Lumen 证明的是多模态产品化、Provider 抽象、任务状态和结果复核能力。
- 真实验证范围是 Seedream 4.5 文生图与图生图。

## 不得口述

- 不说液化、修复、消除或其他编辑模式已经验证。
- 不说所有 Provider 都完成同等验证。
- 不把健康接口 200 或 Preview 只读探针说成完整编辑链路可用。
