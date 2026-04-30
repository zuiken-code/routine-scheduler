import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['assets/icon.ico'],
    devOptions: {
      enabled: true
    },
    manifest: {
      name: 'やることセット',
      short_name: 'やることセット',
      description: '曜日や状況に応じて1日のルーティンセットを切り替え、達成状況をシンプルに記録・可視化できる習慣管理アプリ',
      theme_color: '#ffffff',
      start_url: '/',
      display: 'standalone',
      icons: [
        {
          src: '/assets/192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/assets/512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })
  ]
});
