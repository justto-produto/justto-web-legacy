import Vue from 'vue'

const userMutations = {
  setUserWorkspaces: (state, workspaces) => (Vue.set(state, 'workspaces', workspaces))
}

export default userMutations
