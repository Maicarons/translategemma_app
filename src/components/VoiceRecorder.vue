<template>
  <n-card :title="$t('app.voiceTranslation')" class="voice-recorder-card">
    <div class="recorder-content">
      <n-button type="primary" :disabled="isRecording || !isSupported" @click="startRecording" class="record-button">
        <template #icon>
          <n-icon>
            <Mic />
          </n-icon>
        </template>
        {{ $t('voiceRecorder.startRecording') }}
      </n-button>

      <n-button type="error" :disabled="!isRecording" @click="stopRecording" class="stop-button">
        <template #icon>
          <n-icon>
            <Stop />
          </n-icon>
        </template>
        {{ $t('voiceRecorder.stopRecording') }}
      </n-button>

      <div v-if="isRecording" class="recording-indicator">
        <div class="recording-dot"></div>
        <span>{{ $t('voiceRecorder.recording') }}</span>
      </div>

      <n-empty v-if="!isSupported" :description="$t('voiceRecorder.recordingFailed')" />

      <n-input v-model:value="recognitionResult" :placeholder="$t('voiceRecorder.translationResult')" :disabled="true" class="result-input"
        type="textarea" :rows="4" />
    </div>
  </n-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NButton, NCard, NInput, NEmpty, NIcon } from 'naive-ui';
import { Mic, Stop } from '@vicons/ionicons5';
import speechRecognitionService from '../services/speechRecognition';

const isRecording = ref(false);
const isSupported = ref(false);
const recognitionResult = ref('');

onMounted(async () => {
  isSupported.value = speechRecognitionService.isSupported();
  await speechRecognitionService.init();
});

/**
 * 开始录制语音
 */
const startRecording = async () => {
  try {
    await speechRecognitionService.startRecording();
    isRecording.value = true;
  } catch (error) {
    console.error('开始录制失败:', error);
  }
};

/**
   * 停止录制语音
   */
const stopRecording = async () => {
  try {
    await speechRecognitionService.stopRecording();
    isRecording.value = false;

    // 监听语音识别结果
    // 这里需要根据实际实现进行调整
    // 模拟获取识别结果
    setTimeout(async () => {
      // 模拟从服务获取结果
      const result = await speechRecognitionService.processAudio(new Blob());
      recognitionResult.value = result;
    }, 1000);
  } catch (error) {
    console.error('停止录制失败:', error);
  }
};
</script>

<style scoped>
.voice-recorder-card {
  margin: 1rem 0;
}

.recorder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.record-button,
.stop-button {
  min-width: 120px;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f56c6c;
  font-weight: 500;
}

.recording-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f56c6c;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }

  100% {
    transform: scale(0.8);
    opacity: 1;
  }
}

.result-input {
  width: 100%;
  margin-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .voice-recorder-card {
    margin: 0.5rem 0;
  }

  .recorder-content {
    gap: 0.5rem;
  }

  .record-button,
  .stop-button {
    min-width: 100px;
    font-size: 0.9rem;
  }

  .recording-indicator {
    font-size: 0.9rem;
  }

  .recording-dot {
    width: 8px;
    height: 8px;
  }

  .result-input {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {

  .record-button,
  .stop-button {
    min-width: 120px;
    font-size: 0.8rem;
  }

  .recording-indicator {
    font-size: 0.8rem;
  }

  .recording-dot {
    width: 6px;
    height: 6px;
  }

  .result-input {
    font-size: 0.8rem;
  }
}
</style>