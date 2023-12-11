import { defineConfig } from 'vite'
import { resolve } from 'path'
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
function pathResolve(dir: string) {
	return resolve(process.cwd(), '.', dir)
}

export default defineConfig({
	plugins: [vue(),vueJsx()],
	resolve: {
		alias: [
			{
				find: /\/#\//,
				replacement: pathResolve('types')
			},
			{
				find: '@',
				replacement: pathResolve('src')
			},

		],
		dedupe: ['vue'],

	},
})

