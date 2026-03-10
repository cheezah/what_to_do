# UI配置与交互设计规则

## 1. 设计规范

### 色彩系统

- **主色调**: Blue-600 (#2563EB) - 用于按钮、选中状态、高亮。
- **背景色**: Gray-50 (#F9FAFB) - 页面背景。
- **卡片背景**: White (#FFFFFF) - 内容区域。
- **文本色**:
  - 主要: Gray-800 (#1F2937)
  - 次要: Gray-500 (#6B7280)
  - 提示/占位: Gray-400 (#9CA3AF)
- **优先级颜色**:
  - 高: Red-100/700
  - 中: Yellow-100/700
  - 低: Green-100/700
- **操作按钮颜色**:
  - 删除: Red-500 (#EF4444) + hover:bg-red-50
  - 编辑: Blue-600 (#2563EB) + hover:bg-blue-50
  - 默认: Gray-400 (#9CA3AF) + hover:text-gray-600

### 字体与排版

- **字体**: Inter, system-ui (系统默认无衬线字体)。
- **字号**:
  - 标题: 20px (text-xl) / 18px (text-lg)
  - 正文: 16px (text-base) / 14px (text-sm)
  - 辅助: 12px (text-xs)

### 间距与圆角

- **圆角**:
  - 卡片/模态框: 16px (rounded-2xl) / 12px (rounded-xl)
  - 按钮/输入框: Full (rounded-full) 或 8px (rounded-lg)
  - 确认弹窗: 16px (rounded-2xl)
- **间距**: 基于 4px 的倍数 (p-4 = 16px)。

## 2. 交互规范

### 点击交互

- **按钮**: 点击时有轻微缩放 (active:scale-95) 和颜色加深反馈。
- **列表项**: 点击整行触发编辑，Checkbox 点击触发状态切换（阻止冒泡）。
- **删除**: 点击删除图标 -> 显示确认弹窗 -> 确认后删除。
- **操作按钮常驻显示**:
  - 所有编辑/删除按钮常驻显示，不依赖 hover 状态
  - 原因: 移动端无 hover 状态，需保证全设备可用性
  - 默认颜色: text-gray-400
  - Hover 颜色: text-red-500 (删除) / text-blue-600 (编辑)

### 模态框交互

- **打开**: 底部滑入 (slide-in-from-bottom) 或 淡入 (fade-in)。
- **关闭**: 点击右上角关闭按钮或遮罩层。

### 确认弹窗交互

- **触发**: 所有删除操作（任务、子任务、分类、主题）
- **样式**: 居中显示，带遮罩层，红色警告图标
- **按钮**: 取消（灰色）+ 确认（红色/蓝色）
- **动画**: 使用 animations.ts 中的 `backdropVariants` 和 `modalVariants`

### 响应式设计规则

- **移动优先**: 默认适配手机屏幕 (max-w-md mx-auto 模拟手机视窗)。
- **安全区域**: 底部操作栏预留空间，避免遮挡内容 (pb-24)。
- **滚动**: 主内容区域滚动，Header 和 Bottom Bar 固定。
- **默认视图**: 日历默认周视图，更适合移动端屏幕尺寸。

## 3. 组件设计规范

### 3.1 确认弹窗 (ConfirmDialog)

```
结构:
├── Backdrop (半透明黑色遮罩)
└── Modal Container (居中)
    ├── Icon (红色警告图标)
    ├── Title (标题)
    ├── Message (消息内容)
    └── Button Group
        ├── Cancel Button (灰色)
        └── Confirm Button (红色/蓝色)

样式:
- 宽度: max-w-sm (最大 384px)
- 圆角: rounded-2xl (16px)
- 背景: 白色
- 阴影: shadow-xl
- 内边距: p-6 (24px)
```

### 3.2 操作按钮

```
删除按钮:
- 默认: text-gray-400
- Hover: text-red-500 + bg-red-50
- 尺寸: p-1.5
- 圆角: rounded-full

编辑按钮:
- 默认: text-gray-400
- Hover: text-blue-600 + bg-blue-50
- 尺寸: p-1.5
- 圆角: rounded-full
```

### 3.3 日历视图切换

```
视图切换按钮组:
- 容器: bg-gray-100 p-1 rounded-lg
- 选中态: bg-white shadow-sm text-blue-600
- 未选中态: text-gray-400 hover:text-gray-600
- 默认视图: 周视图 (week)
```

### 3.4 日期时间选择器 (DateTimePicker)

```
结构:
├── Trigger Button (触发按钮)
├── Mobile: Bottom Sheet Modal (移动端底部弹窗)
│   ├── Header (标题栏: 年月 + 左右切换)
│   ├── Weekday Headers (星期标题)
│   ├── Days Grid (日期网格)
│   ├── Time Selector (时间选择器 - 非全天)
│   └── Footer (取消/确定按钮)
└── Desktop: Dropdown Panel (桌面端下拉面板)

样式规范:
- 弹窗圆角: rounded-t-2xl (移动端) / rounded-2xl (桌面端)
- 选中日期: bg-blue-600 text-white shadow-md shadow-blue-500/25
- 选中月份/年份: bg-blue-600 text-white
- 时间选择: 两列下拉选择 (时/分)
- 按钮: active:scale-[0.98] 点击反馈
- 动画: 使用 modalVariants 和 backdropVariants
```

### 3.5 自定义下拉选择 (CustomSelect)

```
结构:
├── Trigger Button (触发按钮)
├── Mobile: Bottom Sheet Modal (移动端底部弹窗)
│   ├── Header (标题 + 关闭按钮)
│   └── Options List (选项列表)
└── Desktop: Dropdown Panel (桌面端下拉面板)

样式规范:
- 移动端弹窗:
  - 圆角: rounded-t-2xl
  - 遮罩: bg-black/40 backdrop-blur-[2px]
  - 标题栏: px-4 py-3 border-b border-gray-100
  - 选项高度: py-4 (更大触控区域)
  - 字体: text-base
  - 图标: 20px
  - 动画: 列表项依次滑入 (stagger delay: 0.03s)

- 桌面端下拉:
  - 圆角: rounded-xl
  - 选中背景: bg-blue-50
  - 选中文字: text-blue-700
  - 勾选图标: Check 图标，蓝色

- 选项内容:
  - 支持图标 (icon)
  - 支持颜色标识 (color)
  - 支持文字标签 (label)
```

## 4. 动效设计标准

- **过渡时间**: duration-200 或 duration-300。
- **缓动函数**: ease-out (默认)。
- **场景**:
  - Hover 状态: 颜色过渡。
  - Modal 出现: 位移 + 透明度。
  - ConfirmDialog: 缩放 + 淡入 (使用 animations.ts 常量)。
  - Switch View: 周/月视图切换动画。

## 5. 设计决策说明

### 5.1 为什么操作按钮要常驻显示？

- **问题**: hover 显示在移动端完全不可见
- **解决方案**: 所有操作按钮常驻显示
- **视觉层次**: 使用灰色默认态 + 彩色 hover 态区分主次
- **一致性**: 全平台统一的交互体验

### 5.2 为什么日历默认周视图？

- **移动端适配**: 周视图在窄屏上显示更清晰
- **信息密度**: 避免月视图在小屏幕上过于拥挤
- **用户习惯**: 移动端用户更关注近期任务

### 5.3 确认弹窗的设计原则

- **统一性**: 所有删除操作使用同一组件
- **清晰性**: 红色警告图标明确操作风险
- **可逆性**: 提供取消选项，防止误操作
- **动画**: 流畅的进出动画提升体验

### 5.4 自定义表单组件设计原则

- **避免原生组件**: 不使用浏览器默认样式，确保视觉一致性
- **响应式交互**: 移动端底部弹窗，桌面端下拉面板
- **触控优化**: 移动端选项区域最小 44px 高度
- **视觉反馈**: 选中状态清晰（蓝色高亮 + 勾选图标）
- **动画流畅**: 使用 Framer Motion 实现平滑过渡

### 5.5 移动端底部弹窗设计原则

- **从底部滑入**: 符合移动端操作习惯
- **顶部圆角**: rounded-t-2xl，视觉友好
- **标题栏明确**: 显示当前操作标题 + 关闭按钮
- **遮罩层**: 半透明黑色 + 模糊效果，突出弹窗
- **易于关闭**: 点击遮罩层或关闭按钮均可关闭
- **最大高度限制**: max-h-[70vh]，避免遮挡过多内容

---

_最后更新: 2026-03-10_

## 6. 更新记录

### 2026-03-10 (第二轮)

- 新增 "日期时间选择器 (DateTimePicker)" 组件设计规范
- 新增 "自定义下拉选择 (CustomSelect)" 组件设计规范
- 新增 "自定义表单组件设计原则"
- 新增 "移动端底部弹窗设计原则"
