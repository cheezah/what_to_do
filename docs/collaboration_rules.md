# 交互规范与协作规则

## 1. 欢迎词机制
每次对话开始时，AI 助手应主动展示以下信息：

### 当前项目进度状态
- **阶段**: 维护与优化阶段
- **完成度**: 核心功能 100% 完成，文档已更新。

### 上次对话的待办事项
- [x] 分类管理系统 (CategoryManager) 开发
- [x] UI 一致性重构 (TaskEditModal)
- [x] 时间工具统一 (TimeUtils)
- [x] Bug 修复与自检

### 本次对话可执行的操作选项
1. 检查或更新剩余文档
2. 进行全量回归测试
3. 讨论下一步功能规划 (P3+)

### 文档更新提醒
- [product_plan.md](docs/product_plan.md) (最后更新: 2026-03-09)
- [architecture.md](docs/architecture.md) (最后更新: 2026-03-09)
- [bug_report_20260309.md](docs/bug_report_20260309.md) (新增)
- [deployment_guide.md](docs/deployment_guide.md) (新增: 部署指南)

## 2. 对话约束规则
1.  **强制查看文档**: 在进行任何代码修改前，必须确认相关文档（策划案、架构文档）已更新或与当前请求一致。
2.  **流程推进**: 严格按照 "策划 -> 开发 -> 测试 -> 文档" 的流程进行。
3.  **定期回顾**: 每个阶段结束后，进行一次项目进展总结。
4.  **变更管理**: 对于核心数据模型或架构的变更，必须先更新文档再编写代码。

## 3. 编码规范 (新增)
1.  **类型导入**: 必须使用 `import type` 导入接口和类型，避免 `verbatimModuleSyntax` 错误。
2.  **动画配置**: 统一使用 `src/utils/animations.ts` 中的常量，禁止在组件内硬编码动画参数。
3.  **时间处理**: 严禁直接使用 `date-fns` 或 `Date` 原生方法进行格式化，必须通过 `src/utils/timeUtils.ts` 工具函数。
4.  **组件样式**: 遵循 Design Token，使用 `rounded-xl`, `h-10` 等统一尺寸类，避免随意使用 arbitrary values (如 `h-[38px]`)。
