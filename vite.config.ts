import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import VitePluginHtmlEnv from 'vite-plugin-html-env'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["tailwind-config"],
  },
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
    VitePluginHtmlEnv(),
  ],
  resolve: {
    alias: {
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
    },
  },
})
