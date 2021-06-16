const workspace = JSON.parse(localStorage.getItem('jusworkspace')) || {}
const profile = localStorage.getItem('jusprofile') || ''

export default {
  featuresAndModules: [],
  portifolio: [],
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
    logoUrl: workspace.logoUrl,
    blackList: workspace.blackList,
    properties: workspace.properties || {},
    defaultSigners: [],
    preNegotiation: {
      limitValue: 0,
      keyWords: []
    },
    apiIntegrationConfiguration: {},
    associatedKeyAccount: {
      workspace: { name: '', teamName: '' },
      keyAccount: { name: '', email: '' },
      portifolios: []
    },
    keyAccounts: []
  },
  portifolios: [],
  portifoliosByWorkspace: {},
  redirectNewWorkspace: false
}
