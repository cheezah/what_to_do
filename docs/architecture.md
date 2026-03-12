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
│   ├── Theme: addTheme, updateTheme, deleteTheme, archiveTheme, unarchiveTheme
│   └── Category: addCategory, deleteCategory, archiveCategory, unarchiveCategory
└── Persistence: localStorage ('what-to-do-storage')
```

## 3. 组件架构详解

### 3.1 核心组件

| 组件            | 职责               | 关键特性                                                                          |
| --------------- | ------------------ | --------------------------------------------------------------------------------- |
| Calendar        | 日历展示与日期选择 | 周视图默认，支持周/月切换                                                         |
| TaskList        | 任务列表展示       | 排序、过滤、常驻操作按钮                                                          |
| TaskEditModal   | 任务编辑           | 子任务管理、二次确认删除、自定义日期选择器、自定义下拉选择器、过滤已归档分类/主题 |
| ThemeManager    | 主题管理           | 主题CRUD、关联优先级、归档/取消归档                                               |
| CategoryManager | 分类管理           | 分类CRUD、颜色标识、归档/取消归档                                                 |
| ConfirmDialog   | 通用确认弹窗       | 统一删除确认、动画效果                                                            |
| DateTimePicker  | 日期时间选择       | 自定义日历组件、年/月/日三级选择、时间选择、响应式设计                            |
| CustomSelect    | 下拉选择           | 自定义选择组件、支持图标/颜色、移动端底部弹窗、桌面端下拉列表                     |

### 3.2 组件层次关系

```
App
├── Calendar (独立状态: viewMode)
├── TaskList
│   └── TaskItem (删除按钮常驻显示)
├── TaskEditModal
│   ├── DateTimePicker (自定义日期时间选择)
│   ├── CustomSelect (重复规则、提醒时间选择)
│   ├── CustomSelect (主题选择)
│   ├── CustomSelect (分类选择)
│   ├── SubTaskList
│   │   └── SubTaskItem (删除按钮常驻显示)
│   └── ConfirmDialog (删除确认)
├── ThemeManager
│   └── ConfirmDialog (删除确认)
├── CategoryManager
│   └── ConfirmDialog (删除确认)
├── ConfirmDialog (全局复用)
├── DateTimePicker (可复用)
└── CustomSelect (可复用)
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

### 6.4 自定义表单组件

- **避免原生组件**: 不使用浏览器原生的 `<input type="date">` 和 `<select>`
- **视觉一致性**: 自定义组件完全遵循项目 Design Token
- **响应式设计**: 移动端使用底部弹窗，桌面端使用下拉面板
- **组件复用**: DateTimePicker 和 CustomSelect 设计为可复用组件

### 6.5 移动端适配策略

- **底部弹窗**: 选择类操作在移动端使用底部弹窗（Bottom Sheet）
- **触控优化**: 选项区域最小高度 44px，确保易于点击
- **动画反馈**: 列表项依次滑入，提供流畅的视觉反馈
- **关闭机制**: 提供明确的关闭按钮和点击遮罩层关闭

### 6.6 归档功能设计

- **软删除**: 归档是一种软删除机制，保留数据但不在主界面显示
- **状态管理**: Category 和 Theme 实体新增 `archived` 布尔属性
- **数据隔离**: 已归档项目在编辑任务时不可选择
- **视觉区分**: 已归档项目使用灰色、删除线、标签等方式标识
- **可逆操作**: 支持取消归档，恢复项目的正常使用

### 6.7 Store Selector 最佳实践

- **避免直接过滤**: Store selector 中避免直接返回过滤后的新数组
- **使用 useMemo**: 从 Store 获取原始数据后，使用 useMemo 缓存派生数据
- **防止无限循环**: 确保 selector 返回稳定的引用，避免触发无限重渲染

## 7. 性能优化方案

- **组件按需渲染**: 列表项使用独立的 React 组件，配合 `AnimatePresence` 实现高效动画。
- **动画性能**: 使用 `layout` 属性实现零布局抖动的排序动画，动画运行在 GPU 线程。
- **本地存储优化**: Zustand persist 自动处理序列化和反序列化，性能开销小。
- **CSS 原子化**: Tailwind CSS 生成最小 CSS 文件。
- **避免无限循环**: 使用 `useMemo` 缓存从 Store 派生的数据和 options 数组，防止组件无限重渲染。

## 8. 部署架构

- **构建**: Vite 构建生成静态文件到 `dist` 目录
- **部署**: GitHub Actions 自动部署到 GitHub Pages
- **配置**: `vite.config.ts` 设置 `base: './'` 支持相对路径

---

_最后更新: 2026-03-12_

## 9. 更新记录

### 2026-03-12

- 更新 TaskList 组件，添加分组排序功能
- 新增排序功能设计决策章节
- 更新性能优化方案，添加 useMemo 缓存建议

### 2026-03-11

- 更新 Store Actions 列表，添加归档相关 actions
- 更新核心组件特性描述，添加归档功能
- 新增 "归档功能设计" 设计决策章节
- 新增 "Store Selector 最佳实践" 设计决策章节
- 更新性能优化方案，添加避免无限循环的建议

### 2026-03-10 (第二轮)

- 新增 `DateTimePicker` 组件到核心组件列表
- 新增 `CustomSelect` 组件到核心组件列表
- 更新组件层次关系图，包含新的表单组件
- 新增 "自定义表单组件" 设计决策章节
- 新增 "移动端适配策略" 设计决策章节
