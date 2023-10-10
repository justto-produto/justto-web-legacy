process.env.VUE_APP_VERSION = require('./package.json').version
const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const { CKEditorTranslationsPlugin } = require('@ckeditor/ckeditor5-dev-translations')
const { styles } = require('@ckeditor/ckeditor5-dev-utils')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/app',
  configureWebpack: {
    entry: {
      app: path.join(__dirname, 'src', 'main.js')
    },
    output: {
      // library: `${name}-[name]`,
      libraryTarget: 'system',
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      chunkFilename: 'chunks/[name].js'
      // chunkLoadingGlobal: `webpackJsonp_${name}`
    },
    plugins: [
      new CKEditorTranslationsPlugin({
        language: 'pt-BR',
        translationsOutputFile: /app/
      })
    ],
    // devContentSecurityPolicy: "connect-src 'self' ws://localhost:8080/ws 'unsafe-eval'"
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      // 'Content-Security-Policy': "connect-src 'self' localhost:* ws://localhost:* ws://localhost:8080/ws ws://localhost:9000/ws 'unsafe-eval'"
    },
    allowedHosts: 'auto'
  },
  pluginOptions: {
    i18n: {
      locale: 'pt-br',
      fallbackLocale: 'pt-br',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'))
    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader')
    config.module
      .rule('cke-css')
      .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
      .use('postcss-loader')
      .loader('postcss-loader')
      .tap(() => {
        return {
          postcssOptions: styles.getPostCssConfig({
            themeImporter: {
              themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
            },
            minify: true
          })
        }
      })
  },
  // outputDir: undefined,
  // assetsDir: undefined,
  // runtimeCompiler: undefined,
  // parallel: false,
  productionSourceMap: false,
  css: {
    sourceMap: true
  },
  pwa: {
    name: 'ProJuris App',
    themeColor: '#ff9300'
  }
})
