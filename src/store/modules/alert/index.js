import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const alert = {
  state: {
    alerts: []
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default alert
