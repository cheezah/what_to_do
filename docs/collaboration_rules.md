# 交互规范与协作规则

## 1. 欢迎词机制

每次对话开始时，AI 助手应主动展示以下信息：

### 当前项目进度状态

- **阶段**: 维护与优化阶段
- **完成度**: 核心功能 100% 完成，文档已更新。

### 上次对话的待办事项

- [x] GitHub 部署配置与 README 文档
- [x] 删除操作二次确认机制
- [x] 功能图标常驻显示优化
- [x] 默认行为调整（周视图、无分类）
- [x] 架构文档与规范更新

### 本次对话可执行的操作选项

1. 检查或更新剩余文档
2. 进行全量回归测试
3. 讨论下一步功能规划 (P3+)

### 文档更新提醒

- [product_plan.md](docs/product_plan.md) (最后更新: 2026-03-10)
- [architecture.md](docs/architecture.md) (最后更新: 2026-03-10)
- [ui_design.md](docs/ui_design.md) (最后更新: 2026-03-10)
- [collaboration_rules.md](docs/collaboration_rules.md) (最后更新: 2026-03-10)
- [changelog_20260310.md](docs/changelog_20260310.md) (新增: 修改日志)
- [deployment_guide.md](docs/deployment_guide.md) (部署指南)

## 2. 对话约束规则

1.  **强制查看文档**: 在进行任何代码修改前，必须确认相关文档（策划案、架构文档）已更新或与当前请求一致。
2.  **流程推进**: 严格按照 "策划 -> 开发 -> 测试 -> 文档" 的流程进行。
3.  **定期回顾**: 每个阶段结束后，进行一次项目进展总结。
4.  **变更管理**: 对于核心数据模型或架构的变更，必须先更新文档再编写代码。

## 3. 编码规范

### 3.1 基础规范

1.  **类型导入**: 必须使用 `import type` 导入接口和类型，避免 `verbatimModuleSyntax` 错误。
2.  **动画配置**: 统一使用 `src/utils/animations.ts` 中的常量，禁止在组件内硬编码动画参数。
3.  **时间处理**: 严禁直接使用 `date-fns` 或 `Date` 原生方法进行格式化，必须通过 `src/utils/timeUtils.ts` 工具函数。
4.  **组件样式**: 遵循 Design Token，使用 `rounded-xl`, `h-10` 等统一尺寸类，避免随意使用 arbitrary values (如 `h-[38px]`)。

### 3.2 组件开发规范

#### 确认弹窗 (ConfirmDialog)

- **使用场景**: 所有删除操作必须使用 ConfirmDialog，禁止直接使用 `window.confirm()`
- **状态管理**: 每个使用方独立管理 `isOpen` 状态和待删除项ID
- **动画**: 必须使用 `animations.ts` 中的 `backdropVariants` 和 `modalVariants`
- **样式**: 统一使用红色警告图标，白色背景，max-w-sm 宽度

#### 操作按钮

- **常驻显示**: 所有编辑/删除按钮必须常驻显示，禁止依赖 hover 状态
- **颜色规范**:
  - 删除按钮: `text-gray-400` -> `hover:text-red-500 hover:bg-red-50`
  - 编辑按钮: `text-gray-400` -> `hover:text-blue-600 hover:bg-blue-50`
- **尺寸**: `p-1.5 rounded-full`

#### 日历组件

- **默认视图**: 必须设置为周视图 (`'week'`)，而非月视图
- **视图切换**: 保留周/月切换功能，但默认周视图

### 3.3 新增组件规范

当新增通用组件时：

1.  在 `architecture.md` 中更新架构图和组件列表
2.  在 `product_plan.md` 中更新功能模块
3.  在 `ui_design.md` 中添加组件设计规范
4.  确保组件复用 `animations.ts` 中的动画常量
5.  遵循 Design Token 和 Tailwind CSS 规范

## 4. 文档维护规范

### 4.1 文档更新时机

- **架构变更**: 新增/删除组件、修改数据流时更新 `architecture.md`
- **功能变更**: 新增/修改功能时更新 `product_plan.md`
- **UI变更**: 修改样式、交互时更新 `ui_design.md`
- **规范变更**: 修改编码规范时更新 `collaboration_rules.md`
- **每次修改**: 在对应文档末尾更新最后更新时间

### 4.2 文档一致性检查清单

- [ ] 架构图中的组件列表与实际代码一致
- [ ] 产品功能列表与实际功能一致
- [ ] UI规范与实际样式一致
- [ ] 编码规范与实际代码一致
- [ ] 所有文档的最后更新时间已更新

## 5. 代码审查清单

### 5.1 删除操作

- [ ] 是否使用 ConfirmDialog 而非 window.confirm()
- [ ] 是否管理了弹窗的显示状态
- [ ] 是否传递了正确的标题和消息

### 5.2 按钮显示

- [ ] 是否移除了 `opacity-0 group-hover:opacity-100`
- [ ] 是否移除了父元素的 `group` 类
- [ ] 是否使用了正确的默认颜色 (text-gray-400)

### 5.3 动画使用

- [ ] 是否从 `animations.ts` 导入动画常量
- [ ] 是否使用了正确的 variants

### 5.4 类型导入

- [ ] 是否使用 `import type` 导入类型
- [ ] 是否避免了类型作为值使用

---

_最后更新: 2026-03-10_
