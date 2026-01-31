<template>
  <div class="bottom-bar">
    <n-button disabled class="nav-button">
      <template #icon>
        <n-icon>
          <Mic />
        </n-icon>
      </template>
      {{ $t('app.voiceTranslation') }}
    </n-button>
    <n-button :type="activeTab === 'text' ? 'primary' : 'default'" @click="$router.push('/text')" class="nav-button">
      <template #icon>
        <n-icon>
          <DocumentText />
        </n-icon>
      </template>
      {{ $t('app.textTranslation') }}
    </n-button>
    <n-button disabled class="nav-button">
      <template #icon>
        <n-icon>
          <Images />
        </n-icon>
      </template>
      {{ $t('app.imageTranslation') }}
    </n-button>
  </div>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui';
import { Mic, DocumentText, Images } from '@vicons/ionicons5';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'text'
  }
});
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: white;
  padding: 0.5rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 100;
}

.nav-button {
  flex: 1;
  margin: 0 0.25rem;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-button {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .nav-button {
    font-size: 0.7rem;
    padding: 0.4rem;
  }
}
</style>