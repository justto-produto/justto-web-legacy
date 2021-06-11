const CompressionPlugin = require('compression-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  entry: {
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker'
  },
  plugins: [
    new CompressionPlugin(),
    new MonacoWebpackPlugin({
      languages: ['javascript', 'css', 'html', 'typescript']
    })
  ]
}
