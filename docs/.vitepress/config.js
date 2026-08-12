import { defineConfig } from 'vitepress'

// GitHub Pages 项目站的基础路径固定为 /<仓库名>/
// 本仓库名为 translategemma_app，故 base 必须为 /translategemma_app/
// 若后续改用自定义域名，可将 base 改为 '/'
const base = '/translategemma_app/'

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'ITR 语音翻译助手',
  description: '基于 Vue 3、Capacitor 与 MediaPipe 的实时翻译应用 —— 文档',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '参考', link: '/reference/faq' }
    ],

    sidebar: [
      {
        text: '指南',
        collapsed: false,
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '功能介绍', link: '/guide/features' },
          { text: '架构与原理', link: '/guide/architecture' },
          { text: '移动端构建', link: '/guide/mobile' },
          { text: '配置与多语言', link: '/guide/configuration' }
        ]
      },
      {
        text: '参考',
        collapsed: false,
        items: [
          { text: '常见问题（FAQ）', link: '/reference/faq' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Maicarons/translategemma_app' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 Mai'
    }
  },

  // VitePress 只读取顶层的 vite 字段作为 Vite 配置；
  // 构建体积告警阈值必须放在这里才能生效。
  vite: {
    build: {
      chunkSizeWarningLimit: 2000
    }
  }
})
