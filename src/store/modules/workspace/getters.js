import { getStringInitials } from '@/utils'

const workspaceGetters = {
  workspace: state => state.workspace,
  hasWorkspace: state => {
    return state.workspace.status !== '' && state.workspace.status !== 'CREATING'
  },
  creatingWorkspace: state => state.workspace.status === 'CREATING',
  workspaceId: state => state.workspace.id,
  workspaceName: state => state.workspace.name,
  workspaceTeamName: state => state.workspace.teamName,
  workspaceSubdomain: state => state.workspace.subDomain,
  workspaceMembers: state => {
    if (!['be8ee2ed9e984880bcf4f62ed8d6f66a', 'lucasisrael', '6f9e316ca8f7452694110c3bd87b4145'].includes(state.workspace.subDomain)) {
      return state.workspace.members.filter(member => {
        return !!member.accountEmail && !member.accountEmail.includes('@justto.com.br')
      })
    } else {
      return state.workspace.members || []
    }
  },
  workspaceTeam: state => state.workspace.team,
  workspaceMembersSorted: (_state, getters) =>
    getters.workspaceMembers
      .sort((a, b) => {
        const personA = getStringInitials(a.person.name || a.person.email)
        const personB = getStringInitials(b.person.name || b.person.email)

        if (personA < personB) return -1
        else if (personA > personB) return 1
        else return 0
      })
      .filter(r => !r.archived),
  redirectNewWorkspace: state => state.redirectNewWorkspace,
  isAdminProfile: state => state.workspace.profile === 'ADMINISTRATOR',
  workspaceBlackList: state => state.workspace.blackList,
  workspaceProperties: state => state.workspace.properties,
  getWorkspaceDefaultSigners: state => state.workspace.defaultSigners,
  getPreNegotiation: state => state.workspace.preNegotiation,
  getFeaturesAndModules: state => state.featuresAndModules,
  getMappedFeaturesAndModules: state => state.featuresAndModules.reduce((acc, cur, i) => {
    acc[cur.code] = cur.active
    return acc
  }, {/* Valor inicial do acumulador. */}),
  getWorkspaceKeyAccounts: (state) => state.workspace.keyAccounts,
  getPortifolios: (state) => state.portifolios,
  getAssociatedKeyAccount: (state) => state.workspace.associatedKeyAccount,
  getIsDraftManagementActive: state => {
    const draftFeature = {
      active: true,
      ...state.featuresAndModules.find((id) => id === 4)
    }

    return draftFeature.active
  },
  getPortifoliosByWorkspace: (state) => {
    return state.portifoliosByWorkspace
  },
  getApiIntegrationConfiguration: (state) => state.workspace.apiIntegrationConfiguration,
  isWorkspaceRecovery: state => state?.workspace?.properties?.NEGOTIATION_TYPE === 'RECOVERY'
}

export default workspaceGetters
