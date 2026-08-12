# 快速开始

本页介绍如何把 ITR 项目跑起来：克隆代码、安装依赖、放入模型文件、启动开发服务器并构建。

## 环境要求

| 工具 | 版本要求 | 说明 |
| --- | --- | --- |
| Node.js | v18 及以上 | 推荐 LTS 版本 |
| 包管理器 | pnpm | 项目使用 `pnpm-lock.yaml` 锁定依赖 |
| Capacitor CLI | v8（随依赖安装） | 仅移动端构建需要 |

> 如果你的机器上 pnpm 版本与仓库 lockfile（v9.0）不匹配，安装依赖时可能出现
> “Unexpected store location” 报错。请用与 lockfile 同代的 pnpm（9 / 10）执行安装，
> 例如 `npx pnpm@10 install`。

## 获取源码

```bash
git clone https://github.com/Maicarons/translategemma_app.git
cd translategemma_app
```

## 安装依赖

```bash
pnpm install
```

## 添加模型文件（必需）

翻译能力依赖 Google 发布的 **TranslateGemma** 模型权重文件。你需要手动下载并放到
`public/models/` 目录下：

1. 下载模型文件 `translategemma-4b-it-int8-web.task`
   - 官方来源：Google 在 Hugging Face 发布的 `google/translategemma-4b-it` 系列，
     或 MediaPipe 官方示例资源（请以官方页面给出的最新链接为准）。
2. 将文件放入：
   ```
   public/models/translategemma-4b-it-int8-web.task
   ```

> 该权重文件体积较大（数百 MB 级别），**不会被 git 跟踪**（`public/models/` 已在
> `.gitignore` 中忽略）。每位开发者需自行准备。
>
> 代码中模型路径硬编码为 `/models/translategemma-4b-it-int8-web.task`
> （见 `src/services/translation.js`）。若以子路径形式部署 Web 版（如 GitHub Pages
> 的 `/translategemma_app/`），该绝对路径会导致模型加载失败，需要改为相对路径或拼上
> `import.meta.env.BASE_URL`。这一点已在 [FAQ](/reference/faq) 中说明。

## 启动开发服务器

```bash
pnpm run dev
```

浏览器打开终端输出的本地地址（默认 `http://localhost:5173`）即可使用。

## 生产构建

```bash
pnpm run build
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态服务器或 Capacitor 的 Web 层。

## 下一步

- 想了解各项功能，前往 [功能介绍](/guide/features)
- 想理解代码结构，前往 [架构与原理](/guide/architecture)
- 想打包成手机 App，前往 [移动端构建](/guide/mobile)
