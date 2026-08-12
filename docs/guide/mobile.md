# 移动端构建

ITR 通过 **Capacitor** 把同一套 Web 代码打包成 Android / iOS 原生应用。Capacitor 配置见
`capacitor.config.json`：

```json
{
  "appId": "com.example.itr",
  "appName": "itr",
  "webDir": "dist"
}
```

`webDir` 指向 Vite 的构建输出 `dist/`，即原生壳加载的网页资源来自这里。

## 前置条件

- 已安装对应平台的原生工具链：
  - **Android**：Android Studio + Android SDK（`android/` 工程由 Capacitor 生成）
  - **iOS**：Xcode（仅 macOS 可用）
- 全局或本地安装 `@capacitor/cli`（已在 `devDependencies` 中）。

## 同步 Web 产物到原生工程

先构建 Web 层，再把产物同步进原生工程：

```bash
pnpm run sync
# 等价于：vite build && npx cap sync
```

## 构建 Android

```bash
pnpm run android
# 等价于：vite build && npx cap sync && npx cap build android
```

首次构建会在 `android/` 生成原生工程（该目录已被 `.gitignore` 忽略）。
之后可用 Android Studio 打开 `android/` 进行签名、调试与发布。

## 构建 iOS

```bash
pnpm run ios
# 等价于：vite build && npx cap sync && npx cap build ios
```

> 当前 `appId` 为示例值 `com.example.itr`，正式发布前请改为你自己的反向域名，
> 并配置好签名证书。

## 注意事项

- 语音合成依赖 `@capacitor-community/text-to-speech` 原生插件，在真机上可用；
  模拟器或纯 Web 会走 Web Speech API 降级。
- 模型文件 `public/models/*.task` 不会被打包进 git，但会进入 `dist/`，
  构建原生应用时需确保它已存在，否则翻译功能无模型可用。
- 移动端访问模型同样受路径影响：若 `translation.js` 中的 `/models/...` 是绝对路径，
  在 Capacitor 的 `capacitor://` 协议或子路径部署下可能需要调整（参见 [FAQ](/reference/faq)）。
