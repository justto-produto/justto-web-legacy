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
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].hash = true
      args[0].cache = false
      return args
    })
  },
  // baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: {
    sourceMap: true,
    loaderOptions: {
      css: {
        // localIdentName: '[hash:base64:5]',
      }
    }
  }
}
