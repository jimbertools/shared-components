import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const path = require('path');
import styleImport from 'vite-plugin-style-import';

const config: UserConfig = {
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: 'vue',
        replacement: path.resolve('./node_modules/vue')
      }
    ],
  },
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: name => {
            return `element-plus/lib/theme-chalk/${name}.css`;
          },
          resolveComponent: name => {
            return `element-plus/lib/${name}`;
          },
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'shared-components',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'vue'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
};

export default config;
