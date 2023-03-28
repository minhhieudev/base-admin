module.exports = {
  css: {
    sourceMap: false,
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/admin/_variables.scss";'
      }
    }
  },
  publicPath: './',
  productionSourceMap: false,
  outputDir: './public_admin'
}
