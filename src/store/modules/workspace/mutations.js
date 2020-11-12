// import Vue from 'vue'

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
      axios.defaults.headers.common['Workspace'] = workspace.subDomain
      const members = workspace.members ? workspace.members : state.workspace.members
      const profile = workspace.profile ? workspace.profile : state.workspace.profile
      state.workspace = {
        ...workspace,
        members,
        profile
      }
      localStorage.setItem('jusworkspace', JSON.stringify(state.workspace))
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
      subDomain: '',
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
