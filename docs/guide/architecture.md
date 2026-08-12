# 架构与原理

本章说明 ITR 的代码组织、核心服务的工作方式，以及哪些部分已经真实实现、哪些是占位桩。
阅读后可以快速定位要修改的代码。

## 目录结构

```
public/                 静态资源（含不被 git 跟踪的 models/ 模型文件）
src/
  components/           可复用的 Vue 组件
    AppBar.vue          顶部栏
    BottomBar.vue       底部导航 / 设置入口
    ImageTranslator.vue 图片翻译交互组件
    SettingsPanel.vue   设置面板
    TextToSpeech.vue    朗读控制组件
    TextTranslator.vue  文本翻译交互组件
    VoiceRecorder.vue   录音控制组件
  i18n/
    index.js            Vue I18n 配置（5 种界面语言）
  router/
    index.js            Vue Router 路由表
  services/            业务逻辑层（纯 JS 单例）
    modelManager.js     模型加载/缓存管理（占位）
    translation.js      文本/图片翻译（真实推理）
    speechRecognition.js 语音识别（占位桩）
    textToSpeech.js     语音合成（真实）
  utils/
    audioProcessor.js   音频预处理工具
  views/                页面级组件（对应三个路由）
    TextTranslation.vue
    VoiceTranslation.vue
    ImageTranslation.vue
  App.vue               根组件
  main.js               入口
  style.css             全局样式
android/                Capacitor 生成的 Android 工程（git 忽略）
capacitor.config.json   Capacitor 配置
vite.config.js          Vite 配置（含 chunk 拆分、@ 别名）
index.html              应用 HTML 模板
```

## 路由

`src/router/index.js` 使用 `createWebHistory()`，三个页面：

- `/voice` 语音翻译（根路径 `/` 重定向到这里）
- `/text` 文本翻译
- `/image` 图片翻译

路由守卫会依据 `meta.title` 动态设置 `document.title`。

## 核心服务

### translation.js（文本 / 图片翻译，真实实现）

这是项目的核心。初始化时动态 `import('@mediapipe/tasks-genai')`，通过
`FilesetResolver` 加载 MediaPipe 的 WASM 运行时，再用
`LlmInference.createFromOptions` 从 `/models/translategemma-4b-it-int8-web.task`
创建推理器（`maxTokens`、`topK`、`temperature` 等参数已设好，`maxNumImages` 开启以支持图片）。

- `translateText(text, sourceLang, targetLang)`：拼接符合 `chat_template.jinja` 的翻译提示词，
  调用 `generateResponse` 得到译文。
- `translateImage(imageBlob, targetLang)`：把图片转 Data URL，作为多模态输入调用同一个推理器。

`supportedLanguages` 内置了上百个 ISO 639-1 语言代码，用于提示词中的语言名称。

### textToSpeech.js（语音合成，真实实现）

封装 Capacitor 的 `@capacitor-community/text-to-speech`，失败时降级到浏览器
`SpeechSynthesisUtterance`。提供 `speak / stop / pause / resume`，并可设置语速、音调、音量。

### speechRecognition.js（语音识别，占位桩）

`startRecording / stopRecording` 已能用 `MediaRecorder` 采集音频；但
`processAudio` 目前是**模拟调用**（固定延时后返回写死的中文测试文本），Whisper 并未真正接入。
`init()` 调用的 `modelManager.loadModel('whisper', ...)` 也是占位。

### modelManager.js（模型管理，占位桩）

提供了加载、缓存、卸载模型的架子（`loadModel` 仅模拟 0→100% 进度并返回假对象），
真正的模型加载逻辑尚未填入。文本/图片翻译并不经过它，而是直接在 `translation.js` 中
使用 MediaPipe。

## 多语言（i18n）

`src/i18n/index.js` 用 Vue I18n 管理界面文案，默认语言 `zh`、回退语言 `en`，
内置 `zh / en / ja / fr / ko` 五套翻译。

## 构建产物

`vite.config.js` 通过 `manualChunks` 把 `vue`+`vue-router`、`naive-ui`、
`@mediapipe/tasks-genai` 拆成独立 chunk，便于浏览器缓存。注意这里的配置在 Vite 层，
与文档站（VitePress）的 `vite` 配置相互独立。
