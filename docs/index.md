---
layout: home

hero:
  name: ITR 语音翻译助手
  text: 离线优先的实时翻译应用
  tagline: 基于 Vue 3、Capacitor 与 MediaPipe 的跨平台翻译工具
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/Maicarons/translategemma_app

features:
  - title: 文本翻译
    details: 输入文本即时翻译，并支持语音合成朗读译文。底层接入 TranslateGemma 大模型。
  - title: 图片翻译
    details: 借助 MediaPipe Tasks GenAI 的多模态能力，识别图片中的文字并翻译。
  - title: 语音合成
    details: 通过 Capacitor TTS 插件朗读译文，Web 端自动降级到浏览器 Web Speech API。
  - title: 多语言界面
    details: 内置中文、英文、日文、法文、韩文五种界面语言，可随时切换。
  - title: 跨平台
    details: Web 与 Android / iOS 共用一套 Vue 3 代码，由 Capacitor 打包为原生应用。
  - title: 响应式
    details: 同时适配桌面浏览器与移动端屏幕，布局自适应。
---

## 这是什么？

**ITR（即时翻译 / Instant Translation）** 是一个开源的实时翻译应用。它把 Google 的
TranslateGemma 模型跑在浏览器 / 移动端本地，提供文本、图片翻译能力，并以语音合成朗读结果。

项目目前处于早期开发阶段：文本翻译与图片翻译已接入真实的模型推理；语音识别（说话转文字）
当前仍是占位实现，详见 [架构与原理](/guide/architecture)。

## 技术栈

- **Vue 3**（Composition API）+ **Vue Router** + **Vue I18n**
- **Naive UI** 组件库
- **Capacitor**（Android / iOS 原生壳）
- **MediaPipe Tasks GenAI**（TranslateGemma 推理）
- **Web Speech API** / Capacitor TTS（语音合成）
- 构建工具：**Vite**

## 许可证

本项目以 [MPL-2.0](https://www.mozilla.org/MPL/2.0/) 许可证开源。
