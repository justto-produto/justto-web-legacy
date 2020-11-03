const workspaceMutations = {
  redirectNewWorkspaceTrue(state) {
    state.redirectNewWorkspace = true
  },
  redirectNewWorkspaceFalse(state) {
    state.redirectNewWorkspace = false
  },
  setWorkspace(state, workspace) {
    if (workspace) {
      // eslint-disable-next-line
      axios.defaults.headers.common['Workspace'] = workspace.subDomain || workspace.subdomain
      state.workspace = workspace
      localStorage.setItem('jusworkspace', JSON.stringify(workspace))
    }
  },
  setProfile(state, profile) {
    if (profile) {
      state.workspace.profile = profile
      localStorage.setItem('jusprofile', profile)
    }
  },
  clearWorkspace(state) {
    state.workspace = {
      id: '',
      name: '',
      teamName: '',
      type: '',
      status: '',
      subdomain: '',
      profile: '',
      blackList: [],
      members: [],
      properties: {}
    }
    localStorage.removeItem('jusworkspace')
    localStorage.removeItem('jusprofile')
    localStorage.removeItem('jusperson')
  },
  setWorkspaceMembers: (state, members) => (state.workspace.members = members.content),
  setBlackList(state, blackList) {
    if (blackList) state.workspace.blackList = blackList
  }
}

export default workspaceMutations
