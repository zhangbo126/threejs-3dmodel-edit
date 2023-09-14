const { defineConfig } = require('@vue/cli-service')
const publicPath =  process.env.NODE_ENV =='production'? '/three.js3d/':'/'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
  lintOnSave: false,
  assetsDir: 'static',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
    preview: {
      entry: 'src/main.js',
      template: 'public/preview.html',
      filename: 'preview.html',
    },
    modelBase: {
      entry: 'src/main.js',
      template: 'public/modelBase.html',
      filename: 'modelBase.html',
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://zhang_6666.gitee.io/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  },
})
