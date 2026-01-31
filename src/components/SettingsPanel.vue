<template>
  <div class="settings-panel" :class="{ 'active': isActive }">
    <div class="panel-header">
      <h2>{{ $t('settings.title') }}</h2>
      <n-button quaternary @click="closePanel" class="close-button">
        <template #icon>
          <n-icon>
            <Close />
          </n-icon>
        </template>
      </n-button>
    </div>

    <div class="panel-content">
      <!-- 显示语言设置 -->
      <div class="setting-item">
        <h3>{{ $t('settings.displayLanguage') }}</h3>
        <n-select v-model:value="displayLanguage" :options="languageOptions" @update:value="updateDisplayLanguage"
          class="setting-select" />
      </div>

      <!-- 默认源语言设置 -->
      <div class="setting-item">
        <h3>{{ $t('settings.defaultSourceLanguage') }}</h3>
        <n-select v-model:value="defaultSourceLanguage" :options="languageOptions"
          @update:value="updateDefaultSourceLanguage" class="setting-select" />
      </div>

      <!-- 默认翻译语言设置 -->
      <div class="setting-item">
        <h3>{{ $t('settings.defaultTargetLanguage') }}</h3>
        <n-select v-model:value="defaultTargetLanguage" :options="languageOptions"
          @update:value="updateDefaultTargetLanguage" class="setting-select" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { NButton, NIcon, NSelect } from 'naive-ui';
import { Close } from '@vicons/ionicons5';

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const { locale } = useI18n();
const displayLanguage = ref(locale.value);
const defaultSourceLanguage = ref('zh');
const defaultTargetLanguage = ref('en');

const languageOptions = ref([
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: 'Français', value: 'fr' },
  { label: '한국어', value: 'ko' }
]);

const closePanel = () => {
  emit('close');
};

const updateDisplayLanguage = (lang) => {
  locale.value = lang;
  displayLanguage.value = lang;
  // 保存到存储
  saveSetting('displayLanguage', lang);
};

const updateDefaultSourceLanguage = (lang) => {
  defaultSourceLanguage.value = lang;
  // 保存到存储
  saveSetting('defaultSourceLanguage', lang);
};

const updateDefaultTargetLanguage = (lang) => {
  defaultTargetLanguage.value = lang;
  // 保存到存储
  saveSetting('defaultTargetLanguage', lang);
};

const saveSetting = async (key, value) => {
  try {
    if (window.Capacitor) {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({
        key: key,
        value: value
      });
    } else {
      // Web端使用localStorage
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('保存设置失败:', error);
  }
};

const loadSettings = async () => {
  try {
    if (window.Capacitor) {
      const { Preferences } = await import('@capacitor/preferences');

      // 加载显示语言
      const displayLang = await Preferences.get({ key: 'displayLanguage' });
      if (displayLang.value) {
        locale.value = displayLang.value;
        displayLanguage.value = displayLang.value;
      }

      // 加载默认源语言
      const sourceLang = await Preferences.get({ key: 'defaultSourceLanguage' });
      if (sourceLang.value) {
        defaultSourceLanguage.value = sourceLang.value;
      }

      // 加载默认翻译语言
      const targetLang = await Preferences.get({ key: 'defaultTargetLanguage' });
      if (targetLang.value) {
        defaultTargetLanguage.value = targetLang.value;
      }
    } else {
      // Web端使用localStorage
      const displayLang = localStorage.getItem('displayLanguage');
      if (displayLang) {
        locale.value = displayLang;
        displayLanguage.value = displayLang;
      }

      const sourceLang = localStorage.getItem('defaultSourceLanguage');
      if (sourceLang) {
        defaultSourceLanguage.value = sourceLang;
      }

      const targetLang = localStorage.getItem('defaultTargetLanguage');
      if (targetLang) {
        defaultTargetLanguage.value = targetLang;
      }
    }
  } catch (error) {
    console.error('加载设置失败:', error);
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.settings-panel.active {
  left: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eaeaea;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-button {
  padding: 0;
  width: 32px;
  height: 32px;
}

.panel-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.setting-item {
  margin-bottom: 2rem;
}

.setting-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
}

.setting-select {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-panel {
    width: 250px;
    left: -250px;
  }
}

@media (max-width: 480px) {
  .settings-panel {
    width: 200px;
    left: -200px;
  }

  .panel-header {
    padding: 0.75rem;
  }

  .panel-header h2 {
    font-size: 1.1rem;
  }

  .panel-content {
    padding: 0.75rem;
  }

  .setting-item {
    margin-bottom: 1.5rem;
  }

  .setting-item h3 {
    font-size: 0.9rem;
  }
}
</style>