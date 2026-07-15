# Jael Chen AI Product Portfolio

面向 AI 应用 / Agent 产品经理求职的 Next.js 16 作品集升级版。

## 主要改动

- 首页由“项目平铺”改为岗位定位、三项能力证据、三个旗舰案例、五层产品架构、数据飞轮、完整项目库和经历时间线。
- 新增第 9 个 LoRA 客服 Agent 微调案例，包含 1.5B / 7B 训练曲线与本地推理架构证据。
- 9 个项目拆分为 `/projects/[slug]` 独立路由，统一展示问题、职责、决策、架构、证据、取舍和下一步。
- 微信机器人知识检索已按实际情况修正为 JSON 关键词检索（jieba + 字符 bigram 兜底）。
- 估算指标在页面中显式标注，避免将小样本观察写成确定业务结论。
- 修复移动端 Lightbox 导航并支持左右滑动。
- 加入中文一页、中文两页和英文 PDF 简历下载。

## 本地运行

```bash
npm install
npm run dev
```

生产检查：

```bash
npm run lint
npm run build
```

## 部署

可直接导入 Vercel。框架版本为 Next.js 16.2.10。
