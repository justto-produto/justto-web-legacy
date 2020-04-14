const getters = {
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
  redirectNewWorkspace: state => state.redirectNewWorkspace,
  isAdminProfile: state => state.profile === 'ADMINISTRATOR',
  workspaceBlackList: state => state.blackList
}

export default getters
