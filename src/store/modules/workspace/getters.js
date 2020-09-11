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
  workspaceMembersSorted: state =>
    state.members
      .sort((a, b) => {
        if (a.person.name < b.person.name) return -1
        else if (a.person.name > b.person.name) return 1
        else return 0
      })
      .filter(r => !r.archived),
  redirectNewWorkspace: state => state.redirectNewWorkspace,
  isAdminProfile: state => state.profile === 'ADMINISTRATOR',
  workspaceBlackList: state => state.blackList,
  workspaceProperties: state => state.properties,
  getWorkspaceDefaultSigners: state => state.defaultSigners,
}

export default getters
