import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const workspace = JSON.parse(localStorage.getItem('jusworkspace')) || {}
const profile = localStorage.getItem('jusprofile') || ''

const workspaceModule = {
  state: {
    featuresAndModules: [],
    workspace: {
      id: workspace.id,
      name: workspace.name,
      teamName: workspace.teamName,
      type: workspace.type,
      status: workspace.status,
      subDomain: workspace.subDomain,
      profile: profile,
      members: [],
      team: [],
      blackList: workspace.blackList,
      properties: workspace.properties || {},
      defaultSigners: [],
      preNegotiation: {
        limitValue: 0,
        keyWords: []
      }
    },
    redirectNewWorkspace: false
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default workspaceModule
