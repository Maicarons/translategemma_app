# 常见问题（FAQ）

## 翻译功能报错 “加载翻译模型时出错”

通常是模型文件缺失或路径不对：

1. 确认已把 `translategemma-4b-it-int8-web.task` 放到 `public/models/` 下。
2. 确认文件名与代码中一致（`src/services/translation.js` 中硬编码为
   `/models/translategemma-4b-it-int8-web.task`）。
3. 若是 Web 部署在子路径（如 GitHub Pages 的 `/translategemma_app/`），
   绝对路径 `/models/...` 会以站点根域解析，导致 404。需改为基于
   `import.meta.env.BASE_URL` 的相对路径，例如：

   ```js
   const base = import.meta.env.BASE_URL || '/'
   modelAssetPath: base + 'models/translategemma-4b-it-int8-web.task'
   ```

## 语音翻译（说话转文字）没有真实结果

这是**已知限制**，不是配置问题。当前 `src/services/speechRecognition.js` 的
`processAudio` 仍是模拟实现，返回写死的测试文本，Whisper 模型尚未接入。文本翻译与图片翻译
不受影响，可正常使用。

## 模型文件去哪里下载？

`translategemma-4b-it-int8-web.task` 由 Google 发布，可在 Hugging Face 的
`google/translategemma-4b-it` 官方仓库或 MediaPipe 官方示例资源获取。请以官方页面提供的
最新下载链接为准。该文件体积较大，且**不纳入 git**（`public/models/` 已被忽略）。

## 安装依赖时报 “Unexpected store location”

说明你本机的 pnpm 版本与仓库 `pnpm-lock.yaml`（lockfile v9.0）不匹配——
现有依赖是用更新的 pnpm（store 布局 v10/v11）安装的，而你 PATH 上的 pnpm 太旧（默认 v3 store）。

解决：用与 lockfile 同代的 pnpm 执行，例如：

```bash
npx pnpm@10 install
```

## 本地文档站怎么预览？

```bash
pnpm run docs:dev      # 开发预览，带热更新
pnpm run docs:build    # 构建到 docs/.vitepress/dist/
pnpm run docs:preview  # 本地预览构建产物
```

## 文档部署后，直接访问某个页面 404？

GitHub Pages 对 `/guide/xxx/` 这类路径只会去找 `xxx/index.html`，而 VitePress 对叶子页
生成的是 `xxx.html`，因此「硬刷新 / 直接粘贴链接」会 404。本项目已在
`pnpm run docs:build` 中接入 `tools/fix-leaf-html.mjs`，构建后会自动为每个叶子页补一个
极小的 `xxx/index.html` 重定向页，从而避免该问题。站内点击导航不受影响。

## 为什么文档站和 App 是两个不同的构建？

- App 由根目录的 `vite.config.js` 构建，产物 `dist/` 是应用本身。
- 文档由 `docs/.vitepress/config.js` 构建，产物 `docs/.vitepress/dist/` 是文档站。

两者相互独立：`pnpm run build` 构建应用，`pnpm run docs:build` 构建文档。
