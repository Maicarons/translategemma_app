import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { create,
  NButton,
  NCard,
  NInput,
  NSelect,
  NIcon,
  NProgress,
  NDialog,
  NDivider,
  NTabs,
  NTab,
  NList,
  NListItem,
  NEmpty,
  NAlert
} from 'naive-ui'
import modelManager from './services/modelManager'
import translationService from './services/translation'
import i18n from './i18n'

// 导入并注册PWA Elements，用于Capacitor在Web端的相机和相册功能
import { defineCustomElements } from '@ionic/pwa-elements/loader'
defineCustomElements(window)

const naive = create({
  components: [
    NButton,
    NCard,
    NInput,
    NSelect,
    NIcon,
    NProgress,
    NDialog,
    NDivider,
    NTabs,
    NTab,
    NList,
    NListItem,
    NEmpty,
    NAlert
  ]
})

// 初始化模型管理器
modelManager.init()

// 应用启动时异步加载翻译模型
console.log('开始异步加载翻译模型...')
translationService.init().then(() => {
  console.log('翻译模型加载成功！')
}).catch((error) => {
  console.error('翻译模型加载失败:', error)
})

const app = createApp(App)
app.use(naive)
app.use(router)
app.use(i18n)
app.mount('#app')