# 配置与多语言

本章汇总项目里可调的关键配置项，以及界面语言、默认翻译语言的设置方式。

## 界面语言

界面文案由 `src/i18n/index.js` 中的 Vue I18n 管理，内置五套语言：

| 代码 | 语言 |
| --- | --- |
| `zh` | 中文（默认） |
| `en` | 英文（回退语言） |
| `ja` | 日文 |
| `fr` | 法文 |
| `ko` | 韩文 |

切换入口在底部「设置」面板（`SettingsPanel.vue`），选择会写入本地存储，
下次打开自动应用。

如需新增一种界面语言：在 `messages` 对象中按现有结构补齐对应键值即可。

## 默认翻译语言

设置面板还提供：

- **默认源语言**（`defaultSourceLanguage`）
- **默认目标语言**（`defaultTargetLanguage`）

这些值通过 Capacitor Preferences（Web 端为 `localStorage`）持久化，供文本/图片翻译页
作为初始选项。

## 应用标识（Capacitor）

`capacitor.config.json` 中的 `appId` / `appName` 决定原生应用的包名与显示名。
发布前请改为自有标识。

## Vite 构建配置

`vite.config.js` 关键点：

- `@` 别名指向 `src/`，方便深层导入。
- `manualChunks` 把体积较大的 `naive-ui`、MediaPipe 运行时拆成独立 chunk。
- `publicDir` 为 `public`，模型文件由此目录进入 `dist/`。

## 文档站配置（VitePress）

本仓库的文档由 VitePress 管理，配置文件为 `docs/.vitepress/config.js`：

- `base: '/translategemma_app/'` —— 适配 GitHub Pages 的子路径部署。
- 本地搜索由 `search.provider: 'local'` 提供。
- 构建体积告警阈值放在 `vite.build.chunkSizeWarningLimit` 下。

如需把文档部署到自定义域名，将 `base` 改为 `/` 即可。
