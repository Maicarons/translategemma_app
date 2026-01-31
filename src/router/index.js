import { createRouter, createWebHistory } from 'vue-router';
import VoiceTranslation from '../views/VoiceTranslation.vue';
import TextTranslation from '../views/TextTranslation.vue';
import ImageTranslation from '../views/ImageTranslation.vue';

const routes = [
  {
    path: '/',
    redirect: '/voice'
  },
  {
    path: '/voice',
    name: 'Voice',
    component: VoiceTranslation,
    meta: {
      title: '语音翻译'
    }
  },
  {
    path: '/text',
    name: 'Text',
    component: TextTranslation,
    meta: {
      title: '文本翻译'
    }
  },
  {
    path: '/image',
    name: 'Image',
    component: ImageTranslation,
    meta: {
      title: '图片翻译'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'ITR - 语音翻译助手';
  next();
});

export default router;
