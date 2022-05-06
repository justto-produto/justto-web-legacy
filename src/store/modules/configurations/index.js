import teamModule from './team'
import featureModule from './features'

export default {
  actions: {
    ...teamModule.actions,
    ...featureModule.actions
  },

  mutations: {
    ...teamModule.mutations,
    ...featureModule.mutations
  },

  state: {
    ...teamModule.state,
    ...featureModule.state
  },

  getters: {
    ...teamModule.getters,
    ...featureModule.getters
  }
}
