import teamModule from './team'

export default {
  actions: {
    ...teamModule.actions
  },
  mutations: {
    ...teamModule.mutations
  },
  state: {
    ...teamModule.state
  },
  getters: {
    ...teamModule.getters
  }
}
