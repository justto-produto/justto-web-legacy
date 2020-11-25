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
      const preNegotiation = workspace.preNegotiation || state.workspace.preNegotiation
      state.workspace = {
        ...workspace,
        members,
        profile,
        preNegotiation
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
      properties: {},
      preNegotiation: {
        limitValue: 0,
        keywords: []
      }
    }
    localStorage.removeItem('jusworkspace')
    localStorage.removeItem('jusprofile')
    localStorage.removeItem('jusperson')
  },
  setWorkspaceMembers: (state, members) => (state.workspace.members = members.content),
  setBlackList(state, blackList) {
    if (blackList) state.workspace.blackList = blackList
  },
  setPreNegotiationKeywords(state, keywords) {
    state.workspace.preNegotiation.keyWords = keywords
  },
  setPreNegotiationLimitValue(state, value) {
    state.workspace.preNegotiation.limitValue = Number(value)
  }
}

export default workspaceMutations
