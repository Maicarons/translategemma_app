<template>
  <n-card :title="$t('app.imageTranslation')" class="image-translator-card">
    <div class="image-translator-content">
      <!-- 模型加载状态提示 -->
      <n-alert v-if="modelLoadStatus.isLoading" type="info" show-icon :title="$t('model.loading')"
        :description="$t('model.loading')" class="model-alert" />

      <n-alert v-else-if="modelLoadStatus.loadError" type="error" show-icon :title="$t('model.loadingFailed')"
        :description="`${$t('model.loadingFailed')}: ${modelLoadStatus.loadError}`" class="model-alert" />

      <n-alert v-else-if="modelLoadStatus.isLoaded" type="success" show-icon :title="$t('model.loaded')"
        :description="$t('model.loaded')" class="model-alert" />

      <div class="image-selection">
        <n-button type="primary" :disabled="isTranslating" @click="selectImageFromGallery" class="gallery-button">
          <template #icon>
            <n-icon>
              <Images />
            </n-icon>
          </template>
          {{ $t('imageTranslator.selectFromGallery') }}
        </n-button>

        <n-button type="success" :disabled="isTranslating" @click="takePhoto" class="camera-button">
          <template #icon>
            <n-icon>
              <Camera />
            </n-icon>
          </template>
          {{ $t('imageTranslator.takePhoto') }}
        </n-button>
      </div>

      <div v-if="selectedImage" class="image-preview">
        <img :src="selectedImage" alt="选中的图片" class="preview-image" />
        <n-button type="error" :disabled="isTranslating" @click="clearImage" class="clear-button">
          <template #icon>
            <n-icon>
              <Trash />
            </n-icon>
          </template>
          {{ $t('imageTranslator.clearImage') }}
        </n-button>
      </div>

      <n-empty :description="$t('imageTranslator.noImage')" />

      <div class="translation-section" v-if="selectedImage">
        <n-select v-model:value="targetLanguage" :options="languageOptions"
          :placeholder="$t('imageTranslator.targetLanguage')" class="language-select" :disabled="isTranslating" />

        <n-button type="primary" :disabled="!selectedImage || isTranslating || !modelLoadStatus.isLoaded"
          @click="translateImage" class="translate-button">
          <template #icon>
            <n-icon>
              <Send v-if="!isTranslating" />
              <Refresh v-else />
            </n-icon>
          </template>
          {{ isTranslating ? $t('imageTranslator.translating') : $t('imageTranslator.translateImage') }}
        </n-button>

        <n-progress v-if="isTranslating" type="line" :percentage="translationProgress" class="translation-progress" />

        <n-input v-model:value="translationResult" :placeholder="$t('imageTranslator.result')" :disabled="true"
          class="result-textarea" type="textarea" :rows="6" />
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { NButton, NCard, NInput, NSelect, NEmpty, NIcon, NProgress, NAlert } from 'naive-ui';
import { Images, Camera, Trash, Send, Refresh } from '@vicons/ionicons5';
import translationService from '../services/translation';

const selectedImage = ref(null);
const targetLanguage = ref('zh');
const translationResult = ref('');
const isTranslating = ref(false);
const translationProgress = ref(0);
const languageOptions = ref([]);
const modelLoadStatus = ref({ isLoading: false, isLoaded: false, loadError: null });
let statusCheckInterval = null;

onMounted(async () => {
  // 加载支持的语言列表
  const languages = translationService.getSupportedLanguages();
  languageOptions.value = languages.map(lang => ({
    label: lang.name,
    value: lang.code
  }));

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
 * 从相册选择图片
 */
const selectImageFromGallery = async () => {
  try {
    // 检查是否在Capacitor环境中
    if (window.Capacitor) {
      const { Camera } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        source: 'photos',
        resultType: 'dataUrl'
      });
      selectedImage.value = image.dataUrl;
    } else {
      // Web端降级方案
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            selectedImage.value = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  } catch (error) {
    console.error('选择图片失败:', error);
  }
};

/**
 * 拍摄照片
 */
const takePhoto = async () => {
  try {
    // 检查是否在Capacitor环境中
    if (window.Capacitor) {
      const { Camera } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        source: 'camera',
        resultType: 'dataUrl'
      });
      selectedImage.value = image.dataUrl;
    } else {
      // Web端降级方案
      alert('在Web端无法使用相机功能，请从相册选择图片');
    }
  } catch (error) {
    console.error('拍摄照片失败:', error);
  }
};

/**
 * 清除选中的图片
 */
const clearImage = () => {
  selectedImage.value = null;
  translationResult.value = '';
};

/**
   * 翻译图片
   */
const translateImage = async () => {
  if (!selectedImage.value) return;

  try {
    isTranslating.value = true;
    translationProgress.value = 0;

    // 验证图片URL
    if (!selectedImage.value.startsWith('data:image/')) {
      throw new Error('无效的图片URL');
    }

    // 模拟翻译进度
    const progressInterval = setInterval(() => {
      if (translationProgress.value < 90) {
        translationProgress.value += 10;
      }
    }, 200);

    // 将dataURL转换为Blob
    const response = await fetch(selectedImage.value);
    const blob = await response.blob();

    // 验证Blob是否为图片
    if (!blob.type.startsWith('image/')) {
      throw new Error('无效的图片文件');
    }

    // 调用翻译服务
    const result = await translationService.translateImage(blob, targetLanguage.value);
    translationResult.value = result;

    clearInterval(progressInterval);
    translationProgress.value = 100;

    // 延迟重置进度条
    setTimeout(() => {
      translationProgress.value = 0;
    }, 500);
  } catch (error) {
    console.error('翻译图片失败:', error);
    translationResult.value = `图片翻译失败: ${error.message}`;
  } finally {
    isTranslating.value = false;
  }
};
</script>

<style scoped>
.image-translator-card {
  margin: 1rem 0;
}

.image-translator-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-selection {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.gallery-button,
.camera-button {
  min-width: 150px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.clear-button {
  margin-top: 0.5rem;
}

.translation-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.language-select {
  min-width: 150px;
}

.translate-button {
  margin: 0.5rem 0;
}

.translation-progress {
  width: 100%;
  max-width: 600px;
  margin: 0.5rem 0;
}

.result-textarea {
  width: 100%;
  max-width: 600px;
}

.model-alert {
  margin-bottom: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-translator-card {
    margin: 0.5rem 0;
  }

  .image-translator-content {
    gap: 1rem;
  }

  .image-selection {
    gap: 0.5rem;
  }

  .gallery-button,
  .camera-button {
    min-width: 120px;
    font-size: 0.9rem;
  }

  .preview-image {
    max-height: 250px;
  }

  .language-select {
    min-width: 120px;
    font-size: 0.9rem;
  }

  .result-textarea {
    max-width: 100%;
    font-size: 0.9rem;
  }

  .translation-progress {
    max-width: 100%;
  }

  .model-alert {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .image-selection {
    flex-direction: column;
    align-items: center;
  }

  .gallery-button,
  .camera-button {
    min-width: 150px;
    font-size: 0.8rem;
  }

  .preview-image {
    max-height: 200px;
  }

  .language-select {
    min-width: 100px;
    font-size: 0.8rem;
  }

  .result-textarea {
    font-size: 0.8rem;
  }
}
</style>