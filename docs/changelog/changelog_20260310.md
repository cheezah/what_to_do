# 项目修改日志 (2026-03-10)

## 对话模型：Kimi-K2.5 #1

## 概述

本次对话针对 WhatToDo 项目进行了多项功能优化和用户体验改进，包括 GitHub 部署配置、删除确认机制、界面显示优化以及默认行为调整。

---

## 1. GitHub 部署与 README 文档

### 1.1 新增文件

- **`.github/workflows/deploy.yml`** - GitHub Actions 工作流配置
  - 实现自动构建并部署到 GitHub Pages
  - 支持推送触发和手动触发

- **`README.md`** (重写)
  - 添加项目功能特性介绍
  - 技术栈说明
  - 项目结构图
  - 快速开始指南
  - 部署指南（GitHub Pages、Vercel、Netlify、Android APK）
  - 使用说明
  - 浏览器兼容性
  - 开发规范
  - 项目进度清单

### 1.2 配置检查

- 确认 `vite.config.ts` 已配置 `base: './'`
- 确认 `public/.nojekyll` 文件存在
- `.gitignore` 已正确配置

---

## 2. 删除操作二次确认机制

### 2.1 新增组件

- **`src/components/ConfirmDialog.tsx`** - 统一确认弹窗组件
  - 使用 Framer Motion 实现流畅动画
  - 支持自定义标题、消息、按钮文字
  - 支持 `danger` 和 `primary` 两种按钮样式
  - 统一的视觉风格（红色警告图标）

### 2.2 修改的文件

#### CategoryManager.tsx

- 将 `window.confirm()` 替换为 `ConfirmDialog` 组件
- 删除分类时提示："确定要删除这个分类吗？关联的任务将自动解除分类绑定。"

#### ThemeManager.tsx

- 将 `window.confirm()` 替换为 `ConfirmDialog` 组件
- 删除主题时提示："确定要删除这个主题吗？关联的任务将自动解除主题绑定。"

#### TaskEditModal.tsx

- 将 `confirm()` 替换为 `ConfirmDialog` 组件
- 删除任务时提示："确定要删除这个任务吗？此操作无法撤销。"

#### TaskList.tsx

- **新增二次确认**（之前直接删除无确认）
- 删除任务时显示任务标题："确定要删除任务"xxx"吗？此操作无法撤销。"

---

## 3. 功能图标常驻显示优化

### 问题描述

事项、主题、分类相关的编辑和删除图标仅在光标悬停时显示，在移动设备上完全不可见。

### 解决方案

移除所有 `opacity-0 group-hover:opacity-100` 样式，使图标在所有设备上常驻显示。

### 修改的文件

#### CategoryManager.tsx

- 移除删除按钮的 `opacity-0 group-hover:opacity-100` 类
- 移除父元素的 `group` 类
- 保留悬停颜色变化效果

#### ThemeManager.tsx

- 移除编辑和删除按钮的 `opacity-0 group-hover:opacity-100` 类
- 移除父元素的 `group` 类
- 保留悬停颜色变化效果

#### TaskList.tsx

- 移除任务删除按钮的 `opacity-0 group-hover:opacity-100` 类
- 移除任务卡片的 `group` 类
- 调整默认颜色为 `text-gray-400`

#### TaskEditModal.tsx

- 移除子任务删除按钮的 `opacity-0 group-hover:opacity-100` 类
- 移除子任务项的 `group` 类

---

## 4. 默认行为调整

### 4.1 快速添加任务默认分类

**修改文件**: `src/App.tsx`

**变更内容**:

- 移除 `handleAddTask` 中的 `categoryId: '1'` 属性
- 快速添加的任务现在默认不绑定任何分类（无分类）
- 用户可在编辑页面手动选择分类

### 4.2 日历默认视图

**修改文件**: `src/components/Calendar.tsx`

**变更内容**:

- 将 `viewMode` 状态默认值从 `'month'` 改为 `'week'`
- 打开应用时日历默认显示周视图
- 用户仍可手动切换到月视图

---

## 5. 技术实现细节

### 5.1 状态管理

- 使用 React `useState` 管理确认弹窗的显示状态
- 使用临时状态存储待删除项的 ID 和标题

### 5.2 动画效果

- 统一使用 `src/utils/animations.ts` 中的动画常量
- 弹窗使用 `backdropVariants` 和 `modalVariants`
- 列表项使用 `listItemVariants`

### 5.3 样式规范

- 遵循 Design Token，使用统一尺寸类
- 删除按钮统一使用红色系（`text-red-500`, `hover:bg-red-50`）
- 编辑按钮统一使用蓝色系（`text-blue-600`, `hover:bg-blue-50`）

---

## 6. 注意事项

### 6.1 移动端适配

- 图标常驻显示后，需确保点击区域足够大（最小 44px）
- 避免图标过于密集导致误触

### 6.2 用户体验

- 二次确认弹窗增加了操作步骤，但有效防止误删
- 默认周视图更适合移动端屏幕尺寸
- 无分类默认让快速添加更简洁

### 6.3 代码规范

- 使用 `import type` 导入 TypeScript 类型
- 时间处理通过 `timeUtils.ts` 工具函数
- 动画配置统一使用 `animations.ts` 常量

---

## 7. 文件变更汇总

### 新增文件

1. `.github/workflows/deploy.yml`
2. `src/components/ConfirmDialog.tsx`
3. `docs/changelog_20260310.md` (本文档)

### 修改文件

1. `README.md` - 重写项目文档
2. `src/components/CategoryManager.tsx` - 删除确认 + 图标常驻
3. `src/components/ThemeManager.tsx` - 删除确认 + 图标常驻
4. `src/components/TaskEditModal.tsx` - 删除确认 + 图标常驻
5. `src/components/TaskList.tsx` - 删除确认 + 图标常驻
6. `src/App.tsx` - 快速添加默认无分类
7. `src/components/Calendar.tsx` - 默认周视图

---

## 8. 后续建议

1. **持久化用户偏好**: 可将视图模式（周/月）保存到 localStorage
2. **批量操作**: 考虑添加任务批量删除功能
3. **撤销功能**: 删除后显示撤销提示（Toast + 撤销按钮）
4. **手势操作**: 移动端支持左滑删除任务

---

_最后更新: 2026-03-10_
