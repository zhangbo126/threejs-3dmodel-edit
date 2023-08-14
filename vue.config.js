const { defineConfig } = require('@vue/cli-service')
const publicPath =  process.env.NODE_ENV =='production'? '/three.js3d/':'/'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
  lintOnSave: false,
  assetsDir: 'static',
  productionSourceMap: false,
})
