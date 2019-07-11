// https://docs.cypress.io/guides/guides/plugins-guide.html

// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

/* eslint-disable import/no-extraneous-dependencies, global-require, arrow-body-style */
// const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    // args.webPreferences.chromeWebSecurity = false
    // args.webPreferences.webSecurity = false
    args.push('--disable-web-security')
    args.push('--user-data-dir=""')
    return args
  })
  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js'
  })
}

// module.exports = (on, config) => {
//   return Object.assign({}, config, {
//     fixturesFolder: 'tests/e2e/fixtures',
//     integrationFolder: 'tests/e2e/specs',
//     screenshotsFolder: 'tests/e2e/screenshots',
//     videosFolder: 'tests/e2e/videos',
//     supportFile: 'tests/e2e/support/index.js'
//   })
// }
