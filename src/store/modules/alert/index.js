import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const alert = {
  state: {
    alerts: []
  },
  mutations,
  actions,
  getters
}

export default alert
