const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/', 
  lintOnSave: false,
  productionSourceMap: true,
})
