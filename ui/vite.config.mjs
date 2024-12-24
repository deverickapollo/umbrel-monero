
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolve from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import {BootstrapVueNextResolver} from 'bootstrap-vue-next';
import checker from 'vite-plugin-checker';
import {fileURLToPath} from 'url';
import path from 'path';
import vueDevTools from 'vite-plugin-vue-devtools';


// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: [BootstrapVueNextResolver(), IconsResolve({prefix: ''})],
      dts: true,
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
    checker({

      // e.g. use TypeScript check
      typescript: true,
    }),
    vueDevTools({
      launchEditor: 'code',
    }),
  ],

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

    }
  }
});
