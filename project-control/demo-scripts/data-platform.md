# Feishu AI 业务数据平台 — 60–90 秒演示脚本

## 主路径

1. 打开 `data-platform-closed-loop`，用来源、候选记录、治理 Gate 和运营视图说明系统边界。
2. 讲 `data-platform-e2e-verification`：候选确认、SOP、写入、幂等、审计和按 record ID 清理形成可回收的 Test Base 链路。
3. 最后展示 `data-platform-schema-verification`，明确生产侧当前是 Schema 元数据只读与表级匹配，不进入正式业务写入。

## 失败处理

`data-platform-portal-entry` 只用来解释公开 Portal 的产品形态。若 Portal 或外部环境不可达，直接使用架构图和证据摘要，不进行外部写入。

## 允许说明

- 17 / 12 是历史 Test Base 验收基线；10 / 216 和 10/10 是当前生产只读检查/表级匹配边界。
- 正式业务 Pilot、字段级差异闭环和通知自动化仍保持关闭或待启用。

## 不得口述

- 不把 Test Base 结果说成生产业务 Pilot 已运行。
- 不公开 Base、table 或凭证标识符。
- 不把 partial 运行说成成功写入案例。
