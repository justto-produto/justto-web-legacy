import Vue from 'vue'

const mutations = {
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

      const { name, teamName, type, status, id, blackList, properties } = workspace
      Vue.set(state, {
        ...state,
        subdomain: workspace.subDomain,
        name,
        teamName,
        type,
        status,
        id,
        blackList,
        properties
      })
      localStorage.setItem('jusworkspace', JSON.stringify(workspace))
    }
  },
  setProfile(state, profile) {
    if (profile) {
      state.profile = profile
      localStorage.setItem('jusprofile', profile)
    }
  },
  clearWorkspace(state) {
    state = {
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
  setWorkspaceMembers: (state, members) => (state.members = members.content),
  setBlackList(state, blackList) {
    if (blackList) state.blackList = blackList
  }
}

export default mutations
