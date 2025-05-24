# VIP AI 助手

一个基于 Next.js 和 OpenAI 的智能对话助手小程序，提供友善、专业的AI对话体验。

## ✨ 功能特性

- 🤖 **智能对话**：基于 OpenAI GPT 模型的自然语言对话
- 💻 **代码支持**：代码高亮显示和解释
- 📝 **Markdown渲染**：支持丰富的文本格式
- 🧮 **数学公式**：支持 LaTeX 数学公式渲染
- 📱 **PWA支持**：可安装为桌面/移动应用
- 🎨 **现代UI**：基于 Ant Design 的精美界面
- 📖 **聊天记录**：本地存储对话历史

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **UI库**: Ant Design + Tailwind CSS
- **AI模型**: OpenAI GPT-3.5-turbo
- **语言**: TypeScript
- **样式**: SCSS + Tailwind CSS
- **部署**: Vercel / 自定义服务器

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm / npm / yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env.local
```

2. 配置 OpenAI API Key：
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 开发模式

```bash
pnpm dev
# 或
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 📁 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/chat/        # API 路由
│   │   ├── globals.css      # 全局样式
│   │   ├── layout.tsx       # 根布局
│   │   └── page.tsx         # 首页
│   ├── components/          # React 组件
│   │   ├── ChatInterface.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── types/               # TypeScript 类型
│   │   └── chat.ts
│   └── utils/               # 工具函数
│       └── chat.ts
├── public/                  # 静态资源
│   └── manifest.json        # PWA 配置
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 配置说明

### OpenAI 配置

在 `.env.local` 文件中配置你的 OpenAI API Key：

```env
OPENAI_API_KEY=sk-...
```

### PWA 配置

应用支持 PWA 功能，可以安装到设备桌面。相关配置在：
- `public/manifest.json` - PWA 清单文件
- `next.config.js` - PWA 构建配置

### 主题定制

可以在以下文件中自定义主题：
- `src/app/layout.tsx` - Ant Design 主题配置
- `tailwind.config.js` - Tailwind CSS 自定义
- `src/app/globals.css` - 全局样式

## 📝 API 说明

### POST /api/chat

发送消息到 AI 助手。

**请求体：**
```json
{
  "messages": [
    {
      "id": "1",
      "content": "Hello",
      "role": "user",
      "timestamp": "2023-12-01T10:00:00Z"
    }
  ]
}
```

**响应：**
```json
{
  "content": "Hello! How can I help you today?"
}
```

## 🎨 界面特色

- **响应式设计**：完美适配桌面和移动设备
- **深色模式**：支持系统主题切换
- **动画效果**：流畅的交互动画
- **代码高亮**：支持多种编程语言语法高亮
- **数学公式**：支持 LaTeX 数学公式渲染

## 🚀 部署

### Vercel 部署（推荐）

1. Fork 本项目
2. 在 Vercel 中导入项目
3. 配置环境变量 `OPENAI_API_KEY`
4. 部署完成

### 自定义服务器

```bash
# 构建项目
pnpm build

# 启动服务器
pnpm start
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Ant Design 文档](https://ant.design/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

---

如果觉得这个项目对你有帮助，请给个 ⭐ Star！