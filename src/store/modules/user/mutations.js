import Vue from 'vue'

const userMutations = {
  setUserWorkspaces: (state, workspaces) => (Vue.set(state, 'workspaces', workspaces)),

  updateWorkspaceKeyAccount: (state, { payload: { keyAccountId, workspaceId } }) => {
    const index = state.workspaces.findIndex(({ workspace }) => workspace.id === workspaceId)

    if (index >= 0) {
      Vue.set(state.workspaces[index].workspace, 'keyAccountId', keyAccountId)
    }
  }
}

export default userMutations
