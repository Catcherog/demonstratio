# Jael Chen AI Product Portfolio

面向 AI 应用 / Agent 产品经理求职的 Next.js 16 作品集。

## 结构

- 首页:岗位定位、能力框架、Featured Case Studies、Selected Experiments、经历时间线。
- 三个主案例:飞书 AI 业务数据平台、Service Agent、光砚。
- 实验与辅助能力:微信机器人、内容调研、品牌官网、LoRA 微调、微信小程序。
- 项目详情页统一 9 节模板:Overview / Problem / Product Strategy / System Architecture / Key Workflow / Key Product Decisions / Evidence / Current Version and Roadmap / My Contribution。

## 设计原则

- Target-state-first:产品愿景按最终设想表达,当前版本和证据按真实状态表达。
- Evidence-labeled:已验证、收尾中、后续计划分层展示,不混为一谈。
- 不使用未经证明的绝对业务指标。

## 本地运行

```bash
npm install
npm run dev
```

## 门禁检查

三项门禁分别运行:

```bash
npm run lint            # TypeScript 类型检查
npm run check:portfolio # 内容一致性检查(不调用 build)
npm run build           # Next.js 构建
```

## 历史路由

以下旧路由永久重定向到 `/projects/feishu-platform`:

- `/projects/data-platform`
- `/projects/collator`
- `/projects/feishu-portal`

## 部署

可直接导入 Vercel。框架版本为 Next.js 16.2.10。
