# WhatToDo - H5 待办事项管理系统

一个功能完善的移动端优先待办事项管理应用，采用现代化的技术栈构建，支持日历视图、任务管理、分类标签、主题定制等丰富功能。

[在线预览](https://your-username.github.io/what-to-do) | [项目文档](./docs)

## 功能特性

### 日历视图

- 月视图展示，支持左右滑动切换月份
- 日期下方显示待办事项数量标识（小圆点）
- 点击日期查看当日任务列表
- 快速返回今天功能

### 任务管理

- **快速添加**：底部输入框一键添加任务
- **任务编辑**：支持标题、内容、时间等详细设置
- **完成状态**：点击复选框标记任务完成/未完成
- **任务删除**：支持删除不需要的任务

### 高级功能

- **重复周期**：支持每天、每周、每月、每年重复
- **子任务清单**：可添加子任务，带进度显示
- **提醒设置**：支持提前提醒（15分钟至1天）
- **优先级**：高、中、低三级优先级（颜色区分）
- **分类标签**：自定义分类，支持颜色标识
- **主题关联**：可关联自定义主题色

### 数据管理

- **本地存储**：使用 localStorage 持久化数据
- **分类管理**：创建、删除自定义分类
- **主题管理**：自定义主题颜色和优先级关联

### 用户体验

- **移动端优先**：响应式设计，完美适配手机
- **流畅动画**：60fps 流畅过渡动画
- **手势操作**：支持滑动交互
- **优雅界面**：现代化 UI 设计

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand (支持持久化)
- **动画库**: Framer Motion
- **图标**: Lucide React
- **日期处理**: date-fns
- **测试**: Vitest + React Testing Library

## 项目结构

```
what-to-do/
├── docs/                   # 项目文档
│   ├── product_plan.md     # 产品策划案
│   ├── architecture.md     # 架构文档
│   ├── ui_design.md        # UI设计规范
│   ├── deployment_guide.md # 部署指南
│   └── bug_report_*.md     # 问题修复记录
├── public/                 # 静态资源
├── src/
│   ├── components/         # React 组件
│   │   ├── Calendar.tsx    # 日历组件
│   │   ├── TaskList.tsx    # 任务列表
│   │   ├── TaskEditModal.tsx # 任务编辑弹窗
│   │   ├── CategoryManager.tsx # 分类管理
│   │   └── ThemeManager.tsx    # 主题管理
│   ├── store/              # 状态管理
│   │   └── useStore.ts     # Zustand Store
│   ├── types/              # TypeScript 类型
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   ├── timeUtils.ts    # 时间处理
│   │   ├── taskUtils.ts    # 任务逻辑
│   │   └── animations.ts   # 动画配置
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

构建后的文件将位于 `dist` 目录。

### 预览构建

```bash
npm run preview
```

### 运行测试

```bash
npm run test
```

## 部署指南

### 部署到 GitHub Pages

本项目已配置 GitHub Actions 工作流，支持自动部署到 GitHub Pages：

1. Fork 或克隆本仓库到您的 GitHub 账户
2. 进入仓库 **Settings** -> **Pages**
3. 在 **Build and deployment** 中选择 **GitHub Actions**
4. 推送代码到 `main` 分支，将自动触发部署

或者手动部署：

```bash
npm run build
# 将 dist 文件夹内容推送到 gh-pages 分支
```

### 部署到其他平台

#### Vercel

```bash
npm i -g vercel
vercel
```

#### Netlify

将 `dist` 文件夹拖拽到 Netlify 部署界面即可。

### 打包为 Android APK

本项目支持使用 Capacitor 打包为 Android 应用：

```bash
# 安装 Capacitor
npm install @capacitor/core @capacitor/cli

# 初始化
npx cap init WhatToDo com.example.whattodo

# 构建并同步
npm run build
npx cap sync android

# 打开 Android Studio
npx cap open android
```

详细步骤请参考 [部署指南](./docs/deployment_guide.md)。

## 使用说明

### 添加任务

1. 在首页底部输入框输入任务内容
2. 按回车键或点击确认按钮
3. 任务将添加到当前选中的日期

### 编辑任务

1. 点击任务卡片进入编辑页面
2. 可修改标题、内容、时间、优先级等
3. 点击保存完成编辑

### 管理分类

1. 点击顶部文件夹图标
2. 可添加新分类或删除现有分类
3. 每个分类可设置不同颜色

### 管理主题

1. 点击顶部调色盘图标
2. 可添加自定义主题色
3. 主题可与优先级关联

## 浏览器兼容性

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## 开发规范

- 使用 `import type` 导入类型，避免 `verbatimModuleSyntax` 错误
- 动画配置统一使用 `src/utils/animations.ts` 中的常量
- 时间处理通过 `src/utils/timeUtils.ts` 工具函数
- 遵循 Design Token，使用统一的尺寸和颜色类

详细规范请参考 [协作规则](./docs/collaboration_rules.md)。

## 项目进度

- [x] 日历视图与任务展示
- [x] 快速添加任务
- [x] 任务编辑与删除
- [x] 数据持久化
- [x] 分类管理系统
- [x] 主题管理系统
- [x] 重复任务支持
- [x] 子任务清单
- [x] 优先级与提醒
- [x] 动画与交互优化

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

## 致谢

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)
