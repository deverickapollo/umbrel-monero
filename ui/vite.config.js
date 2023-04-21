import { defineConfig } from "vite";
import createVuePlugin from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    createVuePlugin({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3,
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      vue: "@vue/compat"
    },
  },
  server: {
    proxy: {
      "/v1": {
        target: "http://localhost:8889",
        changeOrigin: true,
        secure: false
      },
      "/ping": {
        target: "http://localhost:8889",
        changeOrigin: true,
        secure: false
      },
    },
  },
});
