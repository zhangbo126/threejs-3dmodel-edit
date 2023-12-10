import { defineConfig } from 'vite'
import { resolve } from 'path'

function pathResolve(dir: string) {
	return resolve(process.cwd(), '.', dir)
  }

export default defineConfig({
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
		dedupe: ['vue']
	  },
})

