import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // target: 'https://frp-hat.top:49728',
        // target: 'http://192.168.0.187:9999',
        target: 'http://localhost:9999',
        changeOrigin: true,
        secure:false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/yao': {
        // target: 'https://frp-hat.top:49728',
        // target: 'http://192.168.0.187:9999',
        target: ' https://yaoyao.dynv6.net',
        changeOrigin: true,
        secure:false,
        rewrite: (path) => path.replace(/^\/yao/, ''),
      },
      '/wan': {
        // target: 'https://frp-hat.top:49728',
        // target: 'http://192.168.0.187:9999',
        target: ' https://wanfengbuwan.dynv6.net',
        changeOrigin: true,
        secure:false,
        rewrite: (path) => path.replace(/^\/wan/, ''),
      },
      '/hui': {
        // target: 'https://frp-hat.top:49728',
        // target: 'http://192.168.0.187:9999',
        target: ' https://huifaguang.dynv6.net',
        changeOrigin: true,
        secure:false,
        rewrite: (path) => path.replace(/^\/hui/, ''),
      },
    },

  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  transpileDependencies: true,

})
