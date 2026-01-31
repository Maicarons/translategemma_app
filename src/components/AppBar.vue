<template>
  <div class="app-bar">
    <h1 class="app-bar-title">{{ title }}</h1>
    <n-button quaternary @click="openSettings" class="menu-button">
      <template #icon>
        <n-icon>
          <Settings />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NButton, NIcon } from 'naive-ui';
import { Settings } from '@vicons/ionicons5';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['open-settings']);

const { locale } = useI18n();

/**
 * 打开设置面板
 */
const openSettings = () => {
  emit('open-settings');
};
</script>

<style scoped>
.app-bar {
  background-color: #4f46e5;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.app-bar-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.menu-button {
  padding: 0;
  width: 40px;
  height: 40px;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-bar {
    padding: 0.75rem;
  }

  .app-bar-title {
    font-size: 1.1rem;
  }

  .menu-button {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .app-bar {
    padding: 0.5rem;
  }

  .app-bar-title {
    font-size: 1rem;
  }

  .menu-button {
    width: 32px;
    height: 32px;
  }
}
</style>