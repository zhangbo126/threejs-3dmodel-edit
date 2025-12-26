import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async mode => {
  const { VITE_APP_BASE_URL } = loadEnv(mode.mode, process.cwd());
  return {
    plugins: [
      vue(),
      vueJsx(),
      tailwindcss()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler" // or 'modern'
        }
      }
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        vue: "vue/dist/vue.esm-bundler.js"
      }
    },
    esbuild: { loader: { ".js": ".jsx" } },
    base: VITE_APP_BASE_URL,
    server: {
      host: "0.0.0.0",
      port: 9999
    },
    build: {
      outDir: "open",
      assetsDir: "static",
      emptyOutDir: true,
      minify: "esbuild",
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
          preview: resolve(__dirname, "preview.html"),
          modelIframe: resolve(__dirname, "modelIframe.html"),
          vrPage: resolve(__dirname, "vrPage.html")
        },
        output: {
          compact: true,
          entryFileNames: "static/js/[name]-[hash].js",
          chunkFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name].[ext]"
        }
      }
    }
  };
});
