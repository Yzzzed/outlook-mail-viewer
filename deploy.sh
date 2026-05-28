#!/bin/bash

# Outlook Mail Viewer - 快速部署脚本

echo "🚀 开始部署到 Cloudflare Pages..."

# 检查是否已初始化 git
if [ ! -d .git ]; then
  echo "📦 初始化 Git 仓库..."
  git init
  git add .
  git commit -m "Initial commit: Outlook Mail Viewer"
else
  echo "✅ Git 仓库已存在"
fi

# 检查是否有远程仓库
if ! git remote | grep -q origin; then
  echo ""
  echo "⚠️  请先在 GitHub 创建仓库，然后运行："
  echo "   git remote add origin https://github.com/你的用户名/outlook-mail-viewer.git"
  echo "   git push -u origin main"
  echo ""
  echo "然后访问 https://dash.cloudflare.com/pages 连接仓库部署"
  exit 1
fi

# 提交最新更改
echo "📝 提交最新更改..."
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有新的更改"

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
git push

echo ""
echo "✅ 代码已推送到 GitHub！"
echo ""
echo "📋 接下来的步骤："
echo "1. 访问 https://dash.cloudflare.com/pages"
echo "2. 点击 'Create a project' → 'Connect to Git'"
echo "3. 选择你的仓库"
echo "4. 构建设置："
echo "   - Framework preset: Vite"
echo "   - Build command: npm run build"
echo "   - Build output directory: dist"
echo "5. 点击 'Save and Deploy'"
echo ""
echo "🎉 部署完成后，你会得到一个 https://your-project.pages.dev 的 URL"
