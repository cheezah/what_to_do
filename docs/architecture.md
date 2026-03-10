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
│   ├── Calendar Component (Month/Week view, date selection)
│   └── TaskList Component (List of tasks with sorting/filtering)
├── Quick Add Bar (Fixed bottom input)
├── TaskEditModal (Full-screen overlay for editing tasks)
├── ThemeManager (Modal for managing themes)
└── CategoryManager (Modal for managing categories)

Store (Zustand)
├── State: tasks[], categories[], themes[], sortOption
├── Actions: 
│   ├── Task: addTask, updateTask, deleteTask, toggleStatus
│   ├── Theme: addTheme, updateTheme, deleteTheme
│   └── Category: addCategory, deleteCategory
└── Persistence: localStorage ('what-to-do-storage')
```

## 3. 数据流设计
1.  **初始化**: 应用启动时，Zustand 从 localStorage 读取数据初始化 Store。
2.  **添加任务**: 用户在 Quick Add Bar 输入 -> 调用 `addTask` action -> 更新 Store -> 自动同步到 localStorage -> UI 重新渲染 TaskList 和 Calendar (dots)。
3.  **查看任务**: 用户点击 Calendar 日期 -> `currentDate` 状态更新 -> TaskList 使用 `isTaskVisibleOnDate` 过滤显示对应日期的任务（支持重复事件）。
4.  **编辑任务**: 用户点击任务 -> `editingTaskId` 状态更新 -> 渲染 TaskEditModal -> 用户保存 -> 调用 `updateTask` -> Store 更新 -> Modal 关闭。
5.  **管理分类/主题**: 用户操作 Manager 组件 -> 调用对应 Store Actions -> 数据更新 -> 关联任务自动刷新显示。

## 4. 模块划分说明
-   `src/components`: UI 组件 (Calendar, TaskList, TaskEditModal, ThemeManager, CategoryManager)。
-   `src/store`: 状态管理 (useStore)。
-   `src/types`: TypeScript 类型定义 (Task, Category, Theme, etc.)。
-   `src/utils`: 工具函数
    -   `taskUtils.ts`: 任务可见性逻辑、重复规则处理。
    -   `timeUtils.ts`: 统一的时间格式化与转换逻辑。
    -   `animations.ts`: Framer Motion 动画常量配置。

## 5. 性能优化方案
-   **组件按需渲染**: 列表项使用独立的 React 组件，配合 `AnimatePresence` 实现高效动画。
-   **动画性能**: 使用 `layout` 属性实现零布局抖动的排序动画，动画运行在 GPU 线程。
-   **本地存储优化**: Zustand persist 自动处理序列化和反序列化，性能开销小。
-   **CSS 原子化**: Tailwind CSS 生成最小 CSS 文件。
