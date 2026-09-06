# Service Agent — 60–90 秒演示脚本

## 主路径

1. 先打开 `service-agent-live-demo-01` 真实录屏，说明这是知识问答与多轮承接的可复核交互证据。
2. 指出用户问题、上下文承接和页面实际回复，再切到 `service-agent-risk-workflow`，解释风险判断、证据支持度和 fail-closed 转人工。
3. 如面试官希望看产品入口，再打开 `service-agent-controlled-demo` 的 B1 / B2 / B3 受控场景。

## 失败处理

实时入口 `service-agent-live-frontend` 只作为次级路径。若 upstream、chat E2E 或网络不稳定，停留在录屏、架构图和受控场景，不重复刷新或发送真实聊天请求。

## 允许说明

- 公开证据支持真实交互录屏、受控 B1 / B2 / B3、Deploy 039 Phase G 后端验证摘要和风险工作流。
- 高风险、证据不足或超出知识范围的问题进入人工接管。

## 不得口述

- 不说“所有问题都能自动回答”。
- 不把回归计数说成回答准确率、线上质量或生产 SLO。
- 不把当前公网可达、READY alias 或旧 SHA 说成已复核的部署 source SHA。
