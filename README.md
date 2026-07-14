# jaelchen.com — AI / Agent 产品经理作品集

基于 Notion 导出内容整理的 Next.js 作品集官网。项目包含 8 个核心案例和 45 张产品截图，采用“Notion 内容结构 + 产品官网视觉”的单页长滚动形式。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 部署到 Vercel

1. 将本目录提交到 GitHub。
2. 登录 Vercel，选择 **Add New → Project**。
3. 导入仓库，Framework Preset 保持 `Next.js`。
4. 不需要环境变量，直接部署。
5. 部署完成后记录默认域名，例如 `jaelchen-portfolio.vercel.app`。

## 通过 EdgeOne 海外站加速

建议先确保 Vercel 默认域名可正常访问，再配置 EdgeOne：

1. 在 EdgeOne 添加站点 `jaelchen.com`，区域选择不包含中国大陆的可用区域。
2. 添加加速域名 `www.jaelchen.com`。
3. 源站类型选择域名，源站填写 Vercel 默认域名。
4. 回源协议选择 HTTPS，端口 443。
5. 回源 Host 设置为 Vercel 默认域名。
6. 获取 EdgeOne 分配的 CNAME。
7. 在 DNSPod 添加：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `www` | CNAME | EdgeOne 分配的 CNAME |

8. 将根域名 `jaelchen.com` 301 跳转到 `https://www.jaelchen.com`。

初期使用 EdgeOne 官方 CNAME，不建议直接写固定优选 IP。

## 内容维护

- 项目文字：`content/projects.ts`
- 项目截图：`public/projects/<slug>/`
- 页面结构：`app/page.tsx`
- 全局视觉：`app/globals.css`
- SEO 信息：`app/layout.tsx`

## 安全说明

Notion 原文中的 API Key 未写入本站代码。任何模型密钥均不得提交到 Git 仓库或前端环境变量。
