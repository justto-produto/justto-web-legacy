const mutations = {
  redirectNewWorkspaceTrue (state) {
    state.redirectNewWorkspace = true
  },
  redirectNewWorkspaceFalse (state) {
    state.redirectNewWorkspace = false
  },
  setWorkspace (state, workspace) {
    if (workspace) {
      // eslint-disable-next-line
      axios.defaults.headers.common['Workspace'] = workspace.subDomain || workspace.subdomain
      state.subdomain = workspace.subDomain
      state.name = workspace.name
      state.teamName = workspace.teamName
      state.type = workspace.type
      state.status = workspace.status
      state.id = workspace.id
      state.blackList = workspace.blackList
      localStorage.setItem('jusworkspace', JSON.stringify(workspace))
    }
  },
  setProfile (state, profile) {
    if (profile) {
      state.profile = profile
      localStorage.setItem('jusprofile', profile)
    }
  },
  clearWorkspace (state) {
    state.id = ''
    state.name = ''
    state.teamName = ''
    state.type = ''
    state.status = ''
    state.subdomain = ''
    state.profile = ''
    state.blackList = []
    state.members = []
    localStorage.removeItem('jusworkspace')
    localStorage.removeItem('jusprofile')
    localStorage.removeItem('jusperson')
  },
  setWorkspaceMembers (state, members) {
    state.members = members
  },
  setBlackList (state, blackList) {
    state.blackList = blackList
  }
}

export default mutations
