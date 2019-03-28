process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'pt-br',
      fallbackLocale: 'pt-br',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: {
    sourceMap: true
  }
}
