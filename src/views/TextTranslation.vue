<template>
  <div class="text-translation-page">
    <!-- APPbar -->
    <AppBar :title="$t('app.textTranslation')" @open-settings="openSettings" />

    <!-- 主内容 -->
    <div class="page-content">
      <TextTranslator />
    </div>

    <!-- Bottombar -->
    <BottomBar activeTab="text" />

    <!-- 设置面板 -->
    <SettingsPanel :is-active="isSettingsPanelActive" @close="closeSettings" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { NButton, NIcon } from 'naive-ui';
import { Mic, DocumentText, Images } from '@vicons/ionicons5';
import TextTranslator from '../components/TextTranslator.vue';
import AppBar from '../components/AppBar.vue';
import BottomBar from '../components/BottomBar.vue';
import SettingsPanel from '../components/SettingsPanel.vue';

// 控制设置面板的显示状态
const isSettingsPanelActive = ref(false);

/**
 * 打开设置面板
 */
const openSettings = () => {
  isSettingsPanelActive.value = true;
};

/**
 * 关闭设置面板
 */
const closeSettings = () => {
  isSettingsPanelActive.value = false;
};
</script>

<style scoped>
.text-translation-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  position: relative;
}

/* 主内容 */
.page-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  padding-bottom: 70px;
  /* 为底部栏留出空间 */
  box-sizing: border-box;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-content {
    padding: 0.5rem;
    padding-bottom: 60px;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 0.25rem;
    padding-bottom: 55px;
  }
}
</style>
