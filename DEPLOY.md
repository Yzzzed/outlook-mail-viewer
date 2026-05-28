# Cloudflare Pages 部署指南

## 一键部署步骤

### 1. 准备 GitHub 仓库
```bash
# 初始化 git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin https://github.com/你的用户名/outlook-mail-viewer.git
git branch -M main
git push -u origin main
```

### 2. 部署到 Cloudflare Pages

1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 授权并选择你的 GitHub 仓库
5. 配置构建设置：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 "Save and Deploy"

### 3. 等待部署完成

部署完成后，你会得到一个 `https://your-project.pages.dev` 的 URL。

## 工作原理

- **前端**: Vite 构建的静态文件部署到 Cloudflare Pages
- **后端**: Cloudflare Pages Functions 自动部署：
  - `/api/oauth/token` → 代理 Microsoft OAuth
  - `/api/graph/*` → 代理 Microsoft Graph API
- **无需额外配置**: Functions 自动处理 CORS 和请求转发

## 本地测试 Functions

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 本地运行（包含 Functions）
npx wrangler pages dev dist
```

## 环境变量（可选）

如果需要配置环境变量，在 Cloudflare Pages 项目设置中添加。

## 自定义域名（可选）

在 Cloudflare Pages 项目设置中可以添加自定义域名。

## 注意事项

- Cloudflare Pages 免费版限制：
  - 每月 500 次构建
  - 无限带宽
  - 100,000 次 Functions 请求/天
- 首次部署可能需要 2-3 分钟
- 后续推送会自动触发重新部署
