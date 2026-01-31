import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          naive: ['naive-ui'],
          genai: ['@mediapipe/tasks-genai']
        }
      }
    }
  },
  // 确保静态资源正确处理
  publicDir: 'public',
  // 配置别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})