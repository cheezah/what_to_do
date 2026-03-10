# 项目部署指南 (Deployment Guide)

本文档详细介绍了如何将 **WhatToDo** 项目部署到手机端，包括 **H5 网页** 和 **Android APK** 两种方式。

## 选项 1: H5 移动端网页 (推荐快速预览)

最简单的方式是将项目作为网页运行，手机通过浏览器访问。

### 1.1 局域网预览 (无需部署)

适用于开发阶段，手机和电脑需连接同一 Wi-Fi。

1.  在终端运行命令：
    ```bash
    npm run dev -- --host
    # 或者
    npx vite --host
    ```
2.  终端会显示类似如下的地址：
    ```
    Network: http://192.168.x.x:5173/
    ```
3.  手机浏览器输入该地址即可访问。

### 1.2 部署到公网 (GitHub Pages / Vercel)

适用于永久访问和分享。

#### 核心说明：为什么本地打开是白屏？

**请注意**：构建后的 `index.html` **不能直接双击打开** (即 `file://` 协议)。

- 现代前端构建 (ES Modules) 必须在 HTTP/HTTPS 服务器环境下运行。
- 如果直接双击打开，浏览器控制台会报错 CORS 错误，导致白屏。
- **验证方法**：在本地运行 `npm run preview`，如果能正常打开，说明构建产物是没问题的。

#### 部署到 GitHub Pages 的正确步骤：

1.  **准备工作**：

    - 项目已添加 `public/.nojekyll` 文件（防止 GitHub 过滤下划线开头的文件）。
    - `vite.config.ts` 已配置 `base: './'`。

2.  **构建项目**：

    ```bash
    npm run build
    ```

    构建完成后会生成 `dist` 目录。

3.  **上传代码**：
    - **方法 A (推荐)**: 使用 `gh-pages` 分支。
      - 安装: `npm install gh-pages -D`
      - 添加脚本到 `package.json`: `"deploy": "gh-pages -d dist"`
      - 运行: `npm run deploy`
    - **方法 B (手动)**:
      - 将 `dist` 文件夹内的**所有内容**（包括 `assets`、`index.html`、`.nojekyll`）推送到仓库。
      - 如果是推送到 `gh-pages` 分支，在 GitHub 仓库设置 -> Pages -> Build and deployment -> Source 选择 `Deploy from a branch` -> 选择 `gh-pages` 分支。
      - 如果是推送到 `main` 分支的 `/docs` 文件夹，则选择 `main` 分支和 `/docs` 文件夹。

#### 部署到 Vercel (最简单，推荐)：

1.  安装 Vercel CLI: `npm i -g vercel`
2.  运行命令: `vercel`
3.  一路回车确认即可。
4.  部署完成后会获得一个 `https://your-project.vercel.app` 的链接。

---

## 选项 2: 打包 Android APK (使用 Capacitor)

如果需要安装到手机上作为独立 App 使用，推荐使用 **Capacitor**。

### 2.1 准备工作

- **Node.js** (已安装)
- **Android Studio** (必须安装，用于编译 APK)
  - 下载地址: [Android Studio 官网](https://developer.android.com/studio)
  - 安装时确保勾选 "Android SDK" 和 "Android SDK Command-line Tools"。

### 2.2 安装与初始化 Capacitor

1.  **安装依赖**：

    ```bash
    npm install @capacitor/core
    npm install -D @capacitor/cli
    ```

2.  **初始化 Capacitor**：

    ```bash
    npx cap init WhatToDo com.example.whattodo
    # App name: WhatToDo
    # App Package ID: com.example.whattodo (可自定义)
    ```

3.  **修改配置**：
    打开 `capacitor.config.json` (或 `capacitor.config.ts`)，确保 `webDir` 指向 `dist`：

    ```json
    {
      "appId": "com.example.whattodo",
      "appName": "WhatToDo",
      "webDir": "dist",
      "bundledWebRuntime": false
    }
    ```

4.  **安装 Android 平台**：
    ```bash
    npm install @capacitor/android
    npx cap add android
    ```

### 2.3 构建与同步

每次修改代码后，都需要执行以下步骤更新 App：

1.  **构建 Web 项目**：

    ```bash
    npm run build
    ```

2.  **同步到 Android 项目**：
    ```bash
    npx cap sync
    ```

### 2.4 编译 APK

1.  **打开 Android Studio**：

    ```bash
    npx cap open android
    ```

    这会自动启动 Android Studio 并加载项目。

2.  **构建 APK**：

    - 等待 Gradle Sync 完成 (首次可能需要较长时间下载依赖)。
    - 在顶部菜单栏选择 **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**。
    - 编译完成后，右下角会提示 "APK(s) generated successfully"。
    - 点击 **locate** 找到 `app-debug.apk` 文件。

3.  **安装到手机**：
    - 将 APK 文件发送到手机并安装。
    - 或者使用 USB 连接手机，在 Android Studio 中点击绿色的 **Run** 按钮直接运行。

### 常见问题

- **白屏问题**：确保 `vite.config.ts` 中的 `base` 设置正确（通常默认为 `/` 即可，Capacitor 会拦截请求）。
- **路由问题**：由于是单页应用 (SPA)，Capacitor 默认支持 Hash 路由。如果使用 History 路由，可能需要额外配置，但本项目的路由配置通常能直接工作。

---

## 选项 3: 打包 iOS App (需要 macOS)

如果你使用 macOS，也可以打包 iOS 应用：

1.  安装 Xcode。
2.  运行 `npm install @capacitor/ios`。
3.  运行 `npx cap add ios`。
4.  运行 `npx cap open ios` 在 Xcode 中编译。
