const userGetters = {
  getUserLanguage: state => state.user.language,
  getUserTimeZone: state => state.user.timeZone,
  getUserBrowserName: state => state.user.browser.name,
  getUserOS: state => state.user.OS.name,
  getUserWorkspaces: state => state.workspaces,
  getMyWorkspaces: state => state.workspaces.map(({ workspace }) => workspace)
}

export default userGetters
