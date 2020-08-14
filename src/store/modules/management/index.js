import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const ManagementModule = {
  state: {
    activeOccurrency: {}
  },
  actions,
  getters,
  mutations
}

export default ManagementModule
