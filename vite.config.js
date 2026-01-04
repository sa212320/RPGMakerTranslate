import {URL, fileURLToPath} from 'node:url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {unheadVueComposablesImports} from '@unhead/vue';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',
        unheadVueComposablesImports,
        {
          'vue-i18n': ['useI18n'],
        },
      ],
      dts: 'types/auto-imports.d.ts',
      eslintrc: {
        // 讓 auto-import 自動生成全域變數配置
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      resolvers: [],
      // 自動引入 src/components 下的所有 Vue 組件
      dirs: ['src/components'],
      // 生成 TypeScript 聲明文件，提供更好的 IDE 支持
      dts: 'types/components.d.ts',
      // 包含子目錄
      deep: true,
      // 包含全局組件聲明
      include: [/\.vue$/, /\.vue\?vue/],
    }),
  ],
});
