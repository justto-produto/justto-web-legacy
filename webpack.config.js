const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  plugins: [
    new CompressionPlugin()
  ],
  configureWebpack: {
    resolve: {
      alias: {
        moment: 'moment/src/moment'
      }
    }
  }
}
