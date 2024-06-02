import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve, join } from "path";
import { createHtmlPlugin } from 'vite-plugin-html'



const createPageHtml = {
    minify: true,
    pages: [
        // 第一个页面的配置
        {
            filename: "index.html",
            template: 'public/index.html',
            entry: "src/main.js",
            injectOptions: {
                data: {
                    title: 'Page 1'
                }
            }
        },
        {
            filename: "preview.html",
            template: 'public/preview.html',
            entry: "src/main.js",
            injectOptions: {
                data: {
                    title: 'Page 2'
                }
            }
        }
    ]
}


const assetsPath = (path) => {
    return join('static', path)
}
export default defineConfig((mode) => {
    const { VITE_USER_NODE_ENV } = loadEnv(mode.mode, process.cwd());
    const base = VITE_USER_NODE_ENV == 'production' ? '/three.js3d/' : '/'
    return {
        plugins: [vue(), vueJsx()],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
                'vue': 'vue/dist/vue.esm-bundler.js'
            }
        },
        assetsInclude: ['**/*.hdr', '**/*.glb'],
        esbuild: { loader: { '.js': '.jsx' } },
        base,
        server: {
            host: '0.0.0.0',
            open: true,
            port: 9999
        },
        build: {
            assetsDir: 'static',
            emptyOutDir: true,
            minify: 'esbuild',
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'index.html'),
                    preview: resolve(__dirname, 'preview.html'),
                },
                output: {
                    compact: true,
                    entryFileNames: "static/js/[name]-[hash].js",
                    chunkFileNames: "static/js/[name]-[hash].js",
                    assetFileNames: "static/[ext]/[name].[ext]",
                }

            },
        },
    }
})
