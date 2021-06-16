import Vue from 'vue'
import ApiConfiguration from '@/models/configurations/ApiConfiguration'

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
  setTeamName(state, { payload }) {
    Vue.set(state.workspace, 'teamName', payload)
    localStorage.setItem('jusworkspace', JSON.stringify(state.workspace))
  },
  updateWorkspaceLogoUrl: (state, logoUrl) => {
    Vue.set(state.workspace, 'logoUrl', logoUrl)
    localStorage.setItem('jusworkspace', JSON.stringify(state.workspace))
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
  setWorkspaceMembers: (state, members) => Vue.set(state.workspace, 'members', members.content),
  setWorkspaceTeam: (state, team) => Vue.set(state.workspace, 'team', team.content),
  setBlackList(state, blackList) {
    if (blackList) state.workspace.blackList = blackList
  },
  setPreNegotiationKeywords: (state, keywords) => (state.workspace.preNegotiation.keyWords = keywords),
  setPreNegotiationLimitValue: (state, value) => (state.workspace.preNegotiation.limitValue = Number(value)),
  setFeaturesAndModules: (state, features) => Vue.set(state, 'featuresAndModules', features.content),
  setWorkspaceKeyAccounts: (state, keyAccounts) => Vue.set(state.workspace, 'keyAccounts', keyAccounts),
  setAssociatedKeyAccount: (state, { keyAccount }) => Vue.set(state.workspace, 'associatedKeyAccount', keyAccount),
  setPortifolio: (state, portifolios) => Vue.set(state, 'portifolios', portifolios),

  addPortifolio: (state, { data: { id, name }, payload: { workspaceId } }) => {
    Vue.set(state, 'portifolios', [
      ...state.portifolios,
      { id: Number(id), name }
    ])

    Vue.nextTick(() => {
      Vue.set(state.portifoliosByWorkspace, workspaceId, [
        ...state.portifoliosByWorkspace[workspaceId],
        Number(id)
      ])
    })
  },

  insertPortifolios: (state, { portifolios, workspaceId }) => {
    Vue.set(state.portifoliosByWorkspace, workspaceId, portifolios)
  },

  setPortifolioToWorkspace: (state, { data, payload }) => {
    console.log(data, payload)
  },
  updateAssociatedKeyAccount: (state, { payload: { keyAccountId } }) => {
    const keyAccount = state.workspace.keyAccounts.find(({ id }) => id === keyAccountId)
    Vue.set(state.workspace, 'associatedKeyAccount', keyAccount)
  },
  setApiIntegrationConfiguration: (state, payload) => {
    if (payload.payload) payload = payload.payload
    payload.properties.forEach(({ key, value }) => {
      payload[key] = value
    })
    Vue.set(state.workspace, 'apiIntegrationConfiguration', new ApiConfiguration(payload))
  }
}

export default workspaceMutations
