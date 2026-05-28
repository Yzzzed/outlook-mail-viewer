import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5177,
    proxy: {
      '/api/oauth': {
        target: 'https://login.microsoftonline.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oauth/, '/common/oauth2/v2.0'),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            // 移除 Origin 和 Referer 头，避免 CORS 检测
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
      '/api/graph': {
        target: 'https://graph.microsoft.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/graph/, '/v1.0'),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
    },
  },
})
