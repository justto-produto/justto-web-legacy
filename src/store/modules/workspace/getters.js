import { getStringInitials } from '@/utils/jusUtils'

const workspaceGetters = {
  workspace: state => state,
  hasWorkspace: state => {
    return state.status !== '' && state.status !== 'CREATING'
  },
  creatingWorkspace: state => state.status === 'CREATING',
  workspaceId: state => state.id,
  workspaceName: state => state.name,
  workspaceTeamName: state => state.teamName,
  workspaceSubdomain: state => state.subdomain,
  workspaceMembers: state => state.members,
  workspaceMembersSorted: state =>
    state.members
      .sort((a, b) => {
        const personA = getStringInitials(a.person.name || a.person.email)
        const personB = getStringInitials(b.person.name || b.person.email)

        if (personA < personB) return -1
        else if (personA > personB) return 1
        else return 0
      })
      .filter(r => !r.archived),
  redirectNewWorkspace: state => state.redirectNewWorkspace,
  isAdminProfile: state => state.profile === 'ADMINISTRATOR',
  workspaceBlackList: state => state.blackList,
  workspaceProperties: state => state.properties,
  getWorkspaceDefaultSigners: state => state.defaultSigners
}

export default workspaceGetters
