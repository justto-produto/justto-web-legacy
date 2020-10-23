const userGetters = {
  getUserLanguage: state => state.user.language,
  getUserTimeZone: state => state.user.timeZone,
  getUserBrowserName: state => state.user.browser.name,
  getUserOS: state => state.user.OS.name
}

export default userGetters
