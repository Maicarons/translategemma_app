# 功能介绍

ITR 围绕三种翻译场景组织界面：**文本翻译**、**语音翻译**、**图片翻译**。下表说明各项功能的
当前实现状态，方便你判断能否直接用于生产。

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| 文本翻译 | ✅ 已实现 | 调用 TranslateGemma 模型推理 |
| 图片翻译 | ✅ 已实现 | MediaPipe 多模态输入（图片 + 提示词） |
| 语音合成（朗读译文） | ✅ 已实现 | Capacitor TTS，Web 端降级到 Web Speech API |
| 语音识别（说话转文字） | ⚠️ 占位桩 | 当前返回写死的测试文本，Whisper 未真正接入 |

## 文本翻译

在「文本翻译」页输入原文，选择源语言与目标语言，点击翻译。结果由 `src/services/translation.js`
调用 TranslateGemma 模型生成；可一键朗读译文。翻译历史会保存在本地。

提示词遵循项目根目录的 `chat_template.jinja` 模板，要求模型只输出译文、不加解释。

## 图片翻译

在「图片翻译」页从相册选择或拍摄照片，选择目标语言后翻译。实现上把图片转为 Data URL，
作为多模态输入传给同一个 TranslateGemma 模型（`maxNumImages` 已开启）。

> 若当前模型权重不支持视觉输入，会抛出 “当前模型不支持图片翻译功能” 的提示。

## 语音合成

`src/services/textToSpeech.js` 优先使用 Capacitor 的 Text-to-Speech 插件；在纯 Web 环境
（无原生插件）下自动降级为浏览器内置的 `window.speechSynthesis`。支持设置语速、音调、音量。

## 语音识别（开发中的能力）

「语音翻译」页负责采集麦克风语音并转写为文字。目前 `src/services/speechRecognition.js`
的 `processAudio` 只是**模拟调用**并返回固定测试文本，Whisper 模型尚未真正接入，
`src/services/modelManager.js` 的 `loadModel` 也仅模拟加载进度。因此在当前版本中，
语音翻译的「识别」环节尚未打通，请勿用于真实场景。

## 设置面板

底部「设置」可调整：

- 界面显示语言（中文 / 英文 / 日文 / 法文 / 韩文）
- 默认源语言
- 默认目标语言

设置通过 Capacitor Preferences 持久化到本地。

## 支持的语言

- **界面语言（UI）**：内置 5 种 —— 中文、英文、日文、法文、韩文（`src/i18n/index.js`）。
- **翻译目标语言**：TranslateGemma 本身覆盖上百种语言；README 列举的中、英、日、法、
  韩、德、西、俄均在模型支持范围内。
