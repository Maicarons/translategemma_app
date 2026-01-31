<template>
  <n-card :title="$t('app.textTranslation')" class="text-translator-card">
    <div class="text-translator-content">
      <!-- 模型加载状态提示 -->
      <n-alert v-if="modelLoadStatus.isLoading" type="info" show-icon :title="$t('model.loading')"
        :description="$t('model.loading')" class="model-alert" />

      <n-alert v-else-if="modelLoadStatus.loadError" type="error" show-icon :title="$t('model.loadingFailed')"
        :description="`${$t('model.loadingFailed')}: ${modelLoadStatus.loadError}`" class="model-alert" />

      <n-alert v-else-if="modelLoadStatus.isLoaded" type="success" show-icon :title="$t('model.loaded')"
        :description="$t('model.loaded')" class="model-alert" />

      <div class="language-selection">
        <n-select v-model:value="sourceLanguage" :options="languageOptions"
          :placeholder="$t('textTranslator.sourceLanguage')" class="language-select" />

        <n-button @click="swapLanguages" class="swap-button">
          <template #icon>
            <n-icon>
              <SwapHorizontal />
            </n-icon>
          </template>
        </n-button>

        <n-select v-model:value="targetLanguage" :options="languageOptions"
          :placeholder="$t('textTranslator.targetLanguage')" class="language-select" />
      </div>

      <div class="input-section">
        <n-input v-model:value="sourceText" :placeholder="$t('textTranslator.inputText')" class="source-input"
          type="textarea" :rows="6" />

        <n-button type="primary" :disabled="!sourceText.trim() || isTranslating" @click="translateText"
          class="translate-button">
          <template #icon>
            <n-icon>
              <Send v-if="!isTranslating" />
              <Refresh v-else />
            </n-icon>
          </template>
          {{ isTranslating ? $t('textTranslator.translating') : $t('textTranslator.translate') }}
        </n-button>
      </div>

      <n-progress v-if="isTranslating" type="line" :percentage="translationProgress" class="translation-progress" />

      <div class="result-section">
        <div class="result-header">
          <h3>{{ $t('textTranslator.translationResult') }}</h3>
          <div class="tts-controls">
            <n-button type="success" :disabled="!translatedText.trim() || isSpeaking" @click="startSpeaking"
              class="tts-button">
              <template #icon>
                <n-icon>
                  <VolumeHigh />
                </n-icon>
              </template>
              {{ isSpeaking ? $t('textTranslator.reading') : $t('textTranslator.readResult') }}
            </n-button>
          </div>
        </div>

        <n-input v-model:value="translatedText" :placeholder="$t('textTranslator.translationResult')" :disabled="true"
          class="result-textarea" type="textarea" :rows="6" />

        <div v-if="isSpeaking" class="speaking-indicator">
          <div class="speaking-wave">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
          </div>
          <span>{{ $t('textTranslator.reading') }}</span>
        </div>
      </div>

      <n-divider :title="$t('textTranslator.history')" />

      <n-list v-if="translationHistory.length > 0" class="history-list">
        <n-list-item v-for="(item, index) in translationHistory" :key="index" class="history-item">
          <div class="history-source">{{ item.sourceText }}</div>
          <div class="history-arrow">→</div>
          <div class="history-target">{{ item.translatedText }}</div>
          <div class="history-language">{{ item.sourceLanguage }} → {{ item.targetLanguage }}</div>
          <div class="history-time">{{ formatTimestamp(item.timestamp) }}</div>
        </n-list-item>
      </n-list>

      <n-empty :description="$t('textTranslator.noHistory')" />
    </div>
  </n-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { NButton, NCard, NInput, NSelect, NDivider, NList, NListItem, NEmpty, NIcon, NProgress, NAlert } from 'naive-ui';
import { Send, SwapHorizontal, Refresh, VolumeHigh, Stop } from '@vicons/ionicons5';
import translationService from '../services/translation';
import textToSpeechService from '../services/textToSpeech';

const sourceLanguage = ref('zh');
const targetLanguage = ref('en');
const sourceText = ref('');
const translatedText = ref('');
const isTranslating = ref(false);
const translationProgress = ref(0);
const languageOptions = ref([]);
const translationHistory = ref([]);
const modelLoadStatus = ref({ isLoading: false, isLoaded: false, loadError: null });
// TTS 相关状态
const isSpeaking = ref(false);
let statusCheckInterval = null;

onMounted(async () => {
  // 加载支持的语言列表
  const languages = translationService.getSupportedLanguages();
  languageOptions.value = languages.map(lang => ({
    label: lang.name,
    value: lang.code
  }));

  // 初始化 TTS 服务
  try {
    await textToSpeechService.init();
  } catch (error) {
    console.error('初始化 TTS 服务失败:', error);
  }

  // 开始检查模型加载状态
  checkModelLoadStatus();
  statusCheckInterval = setInterval(checkModelLoadStatus, 1000);
});

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
});

/**
 * 检查模型加载状态
 */
const checkModelLoadStatus = () => {
  const status = translationService.getLoadStatus();
  modelLoadStatus.value = status;
};

/**
 * 交换源语言和目标语言
 */
const swapLanguages = () => {
  const temp = sourceLanguage.value;
  sourceLanguage.value = targetLanguage.value;
  targetLanguage.value = temp;

  // 同时交换文本
  const tempText = sourceText.value;
  sourceText.value = translatedText.value;
  translatedText.value = tempText;
};

/**
 * 翻译文本
 */
const translateText = async () => {
  if (!sourceText.value.trim()) return;

  try {
    isTranslating.value = true;
    translationProgress.value = 0;

    // 模拟翻译进度
    const progressInterval = setInterval(() => {
      if (translationProgress.value < 90) {
        translationProgress.value += 10;
      }
    }, 200);

    const result = await translationService.translateText(
      sourceText.value,
      sourceLanguage.value,
      targetLanguage.value
    );

    clearInterval(progressInterval);
    translationProgress.value = 100;

    translatedText.value = result;

    // 添加到翻译历史
    translationHistory.value.unshift({
      sourceText: sourceText.value,
      translatedText: result,
      sourceLanguage: sourceLanguage.value,
      targetLanguage: targetLanguage.value,
      timestamp: new Date().toISOString()
    });

    // 限制历史记录数量
    if (translationHistory.value.length > 10) {
      translationHistory.value = translationHistory.value.slice(0, 10);
    }

    // 延迟重置进度条
    setTimeout(() => {
      translationProgress.value = 0;
    }, 500);
  } catch (error) {
    console.error('翻译失败:', error);
    translatedText.value = '翻译失败，请稍后重试';
  } finally {
    isTranslating.value = false;
  }
};

/**
 * 开始朗读翻译结果
 */
const startSpeaking = async () => {
  if (!translatedText.value.trim()) return;

  try {
    isSpeaking.value = true;

    // 根据目标语言选择对应的 TTS 语言代码
    const ttsLanguage = getTtsLanguageCode(targetLanguage.value);

    await textToSpeechService.speak(
      translatedText.value,
      ttsLanguage,
      1.0, // 默认语速
      1.0  // 默认音调
    );

    // 定期检查语音合成状态，确保在完成后更新UI
    const checkInterval = setInterval(() => {
      const currentSpeakingStatus = textToSpeechService.getIsSpeaking();
      if (!currentSpeakingStatus && isSpeaking.value) {
        isSpeaking.value = false;
        clearInterval(checkInterval);
      }
    }, 500);
  } catch (error) {
    console.error('开始朗读失败:', error);
    isSpeaking.value = false;
  }
};

/**
 * 停止朗读
 */
const stopSpeaking = async () => {
  try {
    await textToSpeechService.stop();
    isSpeaking.value = false;
  } catch (error) {
    console.error('停止朗读失败:', error);
    isSpeaking.value = false;
  }
};

/**
 * 根据语言代码获取对应的 TTS 语言代码
 * @param {string} langCode - 语言代码
 * @returns {string} TTS 语言代码
 */
const getTtsLanguageCode = (langCode) => {
  const langMap = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'es': 'es-ES',
    'ru': 'ru-RU'
  };
  return langMap[langCode] || 'zh-CN';
};

/**
 * 格式化时间戳
 * @param {string} timestamp - ISO格式的时间戳
 * @returns {string} 格式化后的时间
 */
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.text-translator-card {
  margin: 1rem 0;
}

.translator-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.language-selectors {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.language-select {
  min-width: 120px;
}

.swap-button {
  margin: 0;
}

.translation-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.source-textarea,
.result-textarea {
  width: 100%;
  max-width: 600px;
}

.translate-button {
  margin: 0;
}

.translation-progress {
  width: 100%;
  max-width: 600px;
  margin-top: 0.5rem;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.history-source {
  font-weight: 500;
}

.history-arrow {
  font-size: 1.2rem;
  color: #666;
}

.history-target {
  color: #4f46e5;
}

.history-language {
  font-size: 0.8rem;
  color: #999;
  align-self: flex-end;
}

.history-time {
  font-size: 0.7rem;
  color: #ccc;
  align-self: flex-end;
  margin-top: 0.25rem;
}

.model-alert {
  margin-bottom: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .text-translator-card {
    margin: 0.5rem 0;
  }

  .translator-content {
    gap: 1rem;
  }

  .language-selectors {
    gap: 0.5rem;
  }

  .language-select {
    min-width: 100px;
    font-size: 0.9rem;
  }

  .source-textarea,
  .result-textarea {
    max-width: 100%;
    font-size: 0.9rem;
  }

  .translation-progress {
    max-width: 100%;
  }

  .history-item {
    padding: 0.5rem;
  }

  .history-arrow {
    font-size: 1rem;
  }

  .history-language {
    font-size: 0.7rem;
  }

  .history-time {
    font-size: 0.6rem;
  }

  .model-alert {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .language-selectors {
    flex-wrap: wrap;
  }

  .language-select {
    min-width: 80px;
    font-size: 0.8rem;
  }

  .source-textarea,
  .result-textarea {
    font-size: 0.8rem;
  }

  .tts-controls {
    flex-direction: column;
    align-items: center;
  }

  .tts-button {
    min-width: 120px;
    font-size: 0.8rem;
  }

  .speaking-indicator {
    font-size: 0.8rem;
  }

  .wave-bar {
    width: 4px;
    height: 20px;
  }

  @keyframes wave {

    0%,
    100% {
      height: 10px;
    }

    50% {
      height: 20px;
    }
  }
}

/* TTS 相关样式 */
.result-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.tts-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.tts-button {
  min-width: 120px;
}

.speaking-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #4f46e5;
  font-weight: 500;
  margin-top: 0.5rem;
}

.speaking-wave {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.wave-bar {
  width: 8px;
  height: 40px;
  background-color: #4f46e5;
  border-radius: 4px;
  animation: wave 1.5s infinite ease-in-out;
}

.wave-bar:nth-child(2) {
  animation-delay: 0.1s;
}

.wave-bar:nth-child(3) {
  animation-delay: 0.2s;
}

.wave-bar:nth-child(4) {
  animation-delay: 0.3s;
}

.wave-bar:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes wave {

  0%,
  100% {
    height: 20px;
  }

  50% {
    height: 40px;
  }
}

/* 响应式设计补充 */
@media (max-width: 768px) {
  .tts-controls {
    gap: 0.5rem;
  }

  .tts-button {
    min-width: 100px;
    font-size: 0.9rem;
  }

  .speaking-indicator {
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .wave-bar {
    width: 6px;
    height: 30px;
  }

  @keyframes wave {

    0%,
    100% {
      height: 15px;
    }

    50% {
      height: 30px;
    }
  }
}
</style>
