
import {defineConfig} from 'vite';
import {createVuePlugin as vue} from 'vite-plugin-vue2';
import checker from 'vite-plugin-checker';

// import {createHtmlPlugin} from 'vite-plugin-html';
// import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    checker({

      // e.g. use TypeScript check
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 9976,
  },

  preview: {
    port: 9976,
  },
  build: {
    sourcemap: true,
    target: 'es2022',
    commonjsOptions: {

      /**
         * Setting to make prod-build working with vue-slider-component
         **/
      requireReturnsDefault: true,
      transformMixedEsModules: true
    },
  }
});
