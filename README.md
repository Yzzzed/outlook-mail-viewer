# Outlook 邮件查看器

一个基于 Material You 设计的 Outlook 邮件批量管理工具，支持批量导入邮箱、查询最新邮件、标签管理和搜索过滤。

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Yzzzed/outlook-mail-viewer)

## ✨ 功能特性

- 📧 **批量导入邮箱** - 支持 CDK 格式批量导入，自动过滤重复邮箱
- 🔍 **智能搜索** - 实时搜索邮箱地址和标签（300ms防抖）
- 🏷️ **标签管理** - 为邮箱添加多个彩色标签，自动生成颜色
- 📬 **邮件查询** - 快速查询指定数量的最新邮件（5/10/20/50）
- 📋 **一键复制** - 快速复制邮箱地址
- 🎨 **Material You 设计** - 现代化的 UI 设计，流畅的动画效果
- 💾 **本地存储** - 数据存储在浏览器 LocalStorage，隐私安全
- 🚀 **一键部署** - 支持 Cloudflare Pages 部署

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### 部署到 Cloudflare Pages

#### 方式1：使用部署脚本（推荐）

```bash
# 运行部署脚本
./deploy.sh
```

#### 方式2：手动部署

1. 推送代码到 GitHub
2. 访问 [Cloudflare Pages](https://dash.cloudflare.com/pages)
3. 点击 "Create a project" → "Connect to Git"
4. 选择你的仓库
5. 构建设置：
   - Framework preset: `Vite`
   - Build command: `pnpm build`
   - Build output directory: `dist`
6. 点击 "Save and Deploy"

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

## 📖 使用说明

### CDK 格式

邮箱凭证格式为：

```
email----password----client_id----refresh_token
```

示例：

```
user1@outlook.com----password1----client_id1----refresh_token1
user2@hotmail.com----password2----client_id2----refresh_token2
```

### 操作流程

1. **导入邮箱**：在文本框中粘贴 CDK 格式的凭证，点击"导入"
2. **选择邮箱**：在邮箱列表中单选一个邮箱
3. **查询邮件**：选择查询数量（5/10/20/50），点击"查询邮件"
4. **查看详情**：在邮件列表中点击"查看"按钮查看完整邮件内容

### 注意事项

- **凭证安全**：凭证存储在浏览器 localStorage，仅限个人使用
- **Token 刷新**：每次查询都会自动刷新 access_token
- **错误处理**：如果 refresh_token 失效，邮箱会被标记为错误状态（⚠️）
- **CORS 支持**：Microsoft Graph API 支持跨域请求，无需后端代理

## 项目结构

```
src/
├── components/          # React 组件
│   ├── ImportSection.tsx
│   ├── AccountList.tsx
│   ├── QuerySection.tsx
│   ├── MailList.tsx
│   ├── MailDetailModal.tsx
│   └── ui/             # shadcn/ui 组件
├── lib/                # 工具函数
│   ├── storage.ts      # localStorage 操作
│   ├── microsoft-api.ts # Graph API 调用
│   └── utils.ts        # CDK 格式解析
├── types/              # TypeScript 类型
│   └── index.ts
├── App.tsx             # 主应用
└── main.tsx            # 入口文件
```

## API 说明

### Microsoft Graph API

- **Token Endpoint**: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
- **Mail Endpoint**: `https://graph.microsoft.com/v1.0/me/messages`
- **所需权限**: `Mail.Read`

### 刷新 Token

```typescript
POST https://login.microsoftonline.com/common/oauth2/v2.0/token

参数:
- client_id: {从 CDK 获取}
- refresh_token: {从 CDK 获取}
- grant_type: refresh_token
- scope: https://graph.microsoft.com/Mail.Read
```

### 查询邮件

```typescript
GET https://graph.microsoft.com/v1.0/me/messages?$top=10&$orderby=receivedDateTime desc

Headers:
- Authorization: Bearer {access_token}
```

## 常见问题

### Q: 导入失败怎么办？

A: 检查 CDK 格式是否正确，每行应包含 4 个字段，用 `----` 分隔。

### Q: 查询邮件时提示"凭证已失效"？

A: refresh_token 可能已过期，需要重新获取 CDK 凭证并导入。

### Q: 能否支持多个邮箱同时查询？

A: 当前版本仅支持单选查询，避免并发请求导致的 API 限流。

### Q: 数据存储在哪里？

A: 所有数据存储在浏览器的 localStorage，不会上传到任何服务器。

## 开发时间

约 3-4 小时（包括设计、开发、测试）

## License

MIT
