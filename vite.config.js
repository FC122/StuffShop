import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2022', // Update the target environment to a version that supports top-level `await`
    brotliSize: false, // Disable brotli compression for easier debugging
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunk splitting
      },
    },
    minify: false, // Disable minification for easier debugging
    terserOptions: {
      compress: false,
      mangle: false,
    },
  },
})
