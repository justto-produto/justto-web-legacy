import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const ManagementModule = {
  state: {
    searchLawyersLoading: false,
    searchedLawyers: []
  },
  actions,
  getters,
  mutations
}

export default ManagementModule
