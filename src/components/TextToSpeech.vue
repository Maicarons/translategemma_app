<template>
  <n-card :title="$t('app.voiceTranslation')" class="text-to-speech-card">
    <div class="tts-content">
      <n-input v-model:value="textToSpeak" :placeholder="$t('textTranslator.inputText')" class="tts-textarea" type="textarea" :rows="4" />

      <div class="tts-controls">
        <n-select v-model:value="ttsLanguage" :options="languageOptions" :placeholder="$t('textTranslator.targetLanguage')" class="language-select" />

        <n-slider v-model:value="speechRate" :min="0.5" :max="2.0" :step="0.1" :tooltip="true" class="rate-slider" />
        <span class="slider-label">语速: {{ speechRate.toFixed(1) }}</span>

        <n-slider v-model:value="speechPitch" :min="0.5" :max="2.0" :step="0.1" :tooltip="true" class="pitch-slider" />
        <span class="slider-label">音调: {{ speechPitch.toFixed(1) }}</span>
      </div>

      <div class="tts-buttons">
        <n-button type="primary" :disabled="!textToSpeak.trim() || isSpeaking" @click="startSpeaking"
          class="speak-button">
          <template #icon>
            <n-icon>
              <VolumeHigh />
            </n-icon>
          </template>
          {{ $t('textTranslator.readResult') }}
        </n-button>
      </div>

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
  </n-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NButton, NCard, NInput, NSelect, NSlider, NIcon } from 'naive-ui';
import { VolumeHigh, Stop } from '@vicons/ionicons5';
import textToSpeechService from '../services/textToSpeech';

const textToSpeak = ref('');
const ttsLanguage = ref('zh-CN');
const speechRate = ref(1.0);
const speechPitch = ref(1.0);
const isSpeaking = ref(false);
const languageOptions = ref([
  { label: '中文', value: 'zh-CN' },
  { label: '英语', value: 'en-US' },
  { label: '日语', value: 'ja-JP' },
  { label: '韩语', value: 'ko-KR' },
  { label: '法语', value: 'fr-FR' },
  { label: '德语', value: 'de-DE' },
  { label: '西班牙语', value: 'es-ES' },
  { label: '俄语', value: 'ru-RU' }
]);

onMounted(async () => {
  await textToSpeechService.init();
});

/**
 * 开始朗读文本
 */
const startSpeaking = async () => {
  if (!textToSpeak.value.trim()) return;

  try {
    isSpeaking.value = true;
    await textToSpeechService.speak(
      textToSpeak.value,
      ttsLanguage.value,
      speechRate.value,
      speechPitch.value
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
</script>

<style scoped>
.text-to-speech-card {
  margin: 1rem 0;
}

.tts-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tts-textarea {
  width: 100%;
}

.tts-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.language-select {
  min-width: 150px;
}

.rate-slider,
.pitch-slider {
  width: 100%;
  max-width: 400px;
}

.slider-label {
  font-size: 0.9rem;
  color: #666;
}

.tts-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.speak-button,
.stop-button {
  min-width: 120px;
}

.speaking-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #4f46e5;
  font-weight: 500;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .text-to-speech-card {
    margin: 0.5rem 0;
  }

  .tts-content {
    gap: 1rem;
  }

  .tts-controls {
    gap: 0.5rem;
  }

  .language-select {
    min-width: 120px;
    font-size: 0.9rem;
  }

  .rate-slider,
  .pitch-slider {
    max-width: 100%;
  }

  .slider-label {
    font-size: 0.8rem;
  }

  .tts-buttons {
    gap: 0.5rem;
  }

  .speak-button,
  .stop-button {
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

@media (max-width: 480px) {
  .language-select {
    min-width: 100px;
    font-size: 0.8rem;
  }

  .tts-buttons {
    flex-direction: column;
    align-items: center;
  }

  .speak-button,
  .stop-button {
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
</style>