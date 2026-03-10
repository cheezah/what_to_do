# Bug 自检与修复报告 (2026-03-09)

## 1. 概述
本次开发周期主要集中在分类管理系统开发、UI 一致性重构以及时间/动画工具的标准化。在此过程中，遇到了数个技术问题，主要涉及 TypeScript 类型系统、模块导入规范以及动画库的类型定义。本报告旨在总结这些问题的原因及解决方案，以避免未来重蹈覆辙。

## 2. 问题清单与分析

### 2.1 TypeScript 导入语法错误 (verbatimModuleSyntax)
- **现象**: 运行时报错 `Uncaught SyntaxError: The requested module ... does not provide an export named 'Task'`.
- **原因**: `tsconfig.json` 开启了 `verbatimModuleSyntax` 选项。在此模式下，TypeScript 编译器不会自动移除仅用作类型的导入。如果使用 `import { Task } from ...` 导入一个 interface，编译后的 JavaScript 代码会尝试去导入一个名为 `Task` 的真实值，导致运行时错误。
- **修复**: 严格使用 `import type { Task }` 语法导入接口和类型。
- **预防**: 在编码规范中明确规定类型导入语法，并利用 ESLint 规则进行自动检查（如果可能）。

### 2.2 Framer Motion 类型不兼容
- **现象**: 在 `TaskList.tsx` 中，将自定义的 `springLayout` 对象传递给 `motion.div` 的 `transition` 属性时报错：`Type '{ type: string; ... }' is not assignable to type 'Transition<any> | undefined'`.
- **原因**: Framer Motion 的 `Transition` 类型定义非常复杂，包含了多种可能的联合类型。直接定义的常量对象往往被推断为具体的字面量类型或宽泛的接口，与库内部严格的类型定义不完全匹配。
- **修复**: 使用 `as any` 进行临时断言，或者更优雅地，明确导入并使用 Framer Motion 的类型定义来声明常量。
- **改进**: 在 `animations.ts` 中显式定义导出常量的类型。

### 2.3 动画缓动函数类型错误
- **现象**: `animations.ts` 中报错 `Type 'number[]' is not assignable to type 'Easing'`.
- **原因**: 定义贝塞尔曲线数组 `[0.4, 0.0, 0.2, 1]` 时，TypeScript 默认推断为 `number[]`（长度可变数组）。而 Framer Motion 的 `CubicBezierEasing` 类型要求是一个固定长度为 4 的元组 `[number, number, number, number]`。
- **修复**: 显式声明类型为 `Record<string, [number, number, number, number]>`，强制编译器将数组视为元组。

### 2.4 未使用的变量与导入 (Lint Errors)
- **现象**: 构建日志中出现大量 Warning，提示 "Variable is declared but never used"。
- **原因**: 在重构过程中（如从 `TaskEditModal` 移除旧的 UI 代码，或从 `CategoryManager` 移除未实现的编辑逻辑），遗留了未使用的 import 语句和 state 变量。
- **修复**: 运行 `npm run lint` 识别所有未使用变量，并逐一清理。
- **预防**: 在提交代码前强制运行 Lint 检查。

## 3. 改进措施与最佳实践

1.  **统一工具库**:
    -   **时间处理**: 严禁在组件中直接调用 `date-fns` 或 `new Date()` 进行格式化。必须使用 `src/utils/timeUtils.ts`。
    -   **动画配置**: 所有动画参数必须引用 `src/utils/animations.ts`，禁止硬编码。

2.  **类型安全**:
    -   始终使用 `import type` 导入接口。
    -   对于第三方库的复杂配置对象（如动画配置），尽可能使用该库导出的类型进行注解。

3.  **UI 规范**:
    -   遵循 Design Token，所有输入框/按钮高度统一为 `h-10`，圆角统一为 `rounded-xl`。
    -   使用 Tailwind 的颜色变量（如 `bg-blue-600`）而非十六进制色值。

## 4. 结论
通过本次重构与修复，项目的代码质量得到了显著提升，消除了潜在的运行时风险，并建立了更严格的开发规范。后续开发应严格遵守本文档及 `collaboration_rules.md` 中的规定。
