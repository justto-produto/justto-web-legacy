// https://docs.cypress.io/guides/guides/plugins-guide.html

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    // args.webPreferences.chromeWebSecurity = false
    // args.webPreferences.webSecurity = false
    args.push('--disable-web-security')
    args.push('--user-data-dir=""')
    return args
  })
  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js'
  })
}
