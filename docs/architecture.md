# 系统主体架构文档

## 1. 技术栈说明

- **前端框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand (配合 persist 中间件实现本地存储)
- **图标库**: Lucide React
- **动画库**: Framer Motion (页面切换、模态框、列表动画)
- **日期处理**: date-fns (配合自定义 timeUtils)
- **测试框架**: Vitest

## 2. 整体架构图

```
App Component
├── Header (Date display, Theme/Category Manager triggers)
├── Main Content
│   ├── Calendar Component (Week/Month view, date selection)
│   └── TaskList Component (List of tasks with sorting/filtering)
├── Quick Add Bar (Fixed bottom input)
├── TaskEditModal (Full-screen overlay for editing tasks)
├── ThemeManager (Modal for managing themes)
├── CategoryManager (Modal for managing categories)
└── ConfirmDialog (Reusable confirmation dialog)

Store (Zustand)
├── State: tasks[], categories[], themes[], sortOption
├── Actions:
│   ├── Task: addTask, updateTask, deleteTask, toggleStatus
│   ├── Theme: addTheme, updateTheme, deleteTheme
│   └── Category: addCategory, deleteCategory
└── Persistence: localStorage ('what-to-do-storage')
```

## 3. 组件架构详解

### 3.1 核心组件

| 组件            | 职责               | 关键特性                  |
| --------------- | ------------------ | ------------------------- |
| Calendar        | 日历展示与日期选择 | 周视图默认，支持周/月切换 |
| TaskList        | 任务列表展示       | 排序、过滤、常驻操作按钮  |
| TaskEditModal   | 任务编辑           | 子任务管理、二次确认删除  |
| ThemeManager    | 主题管理           | 主题CRUD、关联优先级      |
| CategoryManager | 分类管理           | 分类CRUD、颜色标识        |
| ConfirmDialog   | 通用确认弹窗       | 统一删除确认、动画效果    |

### 3.2 组件层次关系

```
App
├── Calendar (独立状态: viewMode)
├── TaskList
│   └── TaskItem (删除按钮常驻显示)
├── TaskEditModal
│   ├── SubTaskList
│   │   └── SubTaskItem (删除按钮常驻显示)
│   └── ConfirmDialog (删除确认)
├── ThemeManager
│   └── ConfirmDialog (删除确认)
├── CategoryManager
│   └── ConfirmDialog (删除确认)
└── ConfirmDialog (全局复用)
```

## 4. 数据流设计

1.  **初始化**: 应用启动时，Zustand 从 localStorage 读取数据初始化 Store。
2.  **添加任务**: 用户在 Quick Add Bar 输入 -> 调用 `addTask` action -> 更新 Store -> 自动同步到 localStorage -> UI 重新渲染 TaskList 和 Calendar (dots)。
3.  **查看任务**: 用户点击 Calendar 日期 -> `currentDate` 状态更新 -> TaskList 使用 `isTaskVisibleOnDate` 过滤显示对应日期的任务（支持重复事件）。
4.  **编辑任务**: 用户点击任务 -> `editingTaskId` 状态更新 -> 渲染 TaskEditModal -> 用户保存 -> 调用 `updateTask` -> Store 更新 -> Modal 关闭。
5.  **删除任务**: 用户点击删除按钮 -> 显示 ConfirmDialog -> 用户确认 -> 调用 `deleteTask` -> Store 更新 -> UI 重新渲染。
6.  **管理分类/主题**: 用户操作 Manager 组件 -> 调用对应 Store Actions -> 显示 ConfirmDialog (删除时) -> 数据更新 -> 关联任务自动刷新显示。

## 5. 模块划分说明

- `src/components`: UI 组件 (Calendar, TaskList, TaskEditModal, ThemeManager, CategoryManager, ConfirmDialog)。
- `src/store`: 状态管理 (useStore)。
- `src/types`: TypeScript 类型定义 (Task, Category, Theme, etc.)。
- `src/utils`: 工具函数
  - `taskUtils.ts`: 任务可见性逻辑、重复规则处理。
  - `timeUtils.ts`: 统一的时间格式化与转换逻辑。
  - `animations.ts`: Framer Motion 动画常量配置。

## 6. 关键设计决策

### 6.1 确认弹窗设计

- **统一组件**: 使用 ConfirmDialog 组件统一所有删除确认
- **状态管理**: 每个使用方独立管理显示状态和待删除项ID
- **动画效果**: 复用 animations.ts 中的动画常量

### 6.2 图标显示策略

- **常驻显示**: 所有操作按钮（编辑、删除）常驻显示，不依赖 hover
- **原因**: 移动端无 hover 状态，需保证全设备可用性
- **视觉层次**: 使用灰色默认态 + 彩色 hover 态区分主次

### 6.3 默认视图设置

- **周视图优先**: Calendar 默认显示周视图，更适合移动端
- **用户偏好**: 未来可考虑持久化用户选择的视图模式

## 7. 性能优化方案

- **组件按需渲染**: 列表项使用独立的 React 组件，配合 `AnimatePresence` 实现高效动画。
- **动画性能**: 使用 `layout` 属性实现零布局抖动的排序动画，动画运行在 GPU 线程。
- **本地存储优化**: Zustand persist 自动处理序列化和反序列化，性能开销小。
- **CSS 原子化**: Tailwind CSS 生成最小 CSS 文件。

## 8. 部署架构

- **构建**: Vite 构建生成静态文件到 `dist` 目录
- **部署**: GitHub Actions 自动部署到 GitHub Pages
- **配置**: `vite.config.ts` 设置 `base: './'` 支持相对路径

---

_最后更新: 2026-03-10_
