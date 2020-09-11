import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const workspace = JSON.parse(localStorage.getItem('jusworkspace')) || {}
const profile = localStorage.getItem('jusprofile') || ''

const workspaceModule = {
  state: {
    id: workspace.id,
    name: workspace.name,
    teamName: workspace.teamName,
    type: workspace.type,
    status: workspace.status,
    subdomain: workspace.subDomain,
    profile: profile,
    members: [],
    redirectNewWorkspace: false,
    blackList: workspace.blackList,
    properties: workspace.properties || {},
    defaultSigners: [],
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
}

export default workspaceModule
