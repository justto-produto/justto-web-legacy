import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const imports = {
  state: {
    file: undefined,
    map: [],
    errorFields: [],
    validationInProgress: false
  },
  mutations,
  actions,
  getters
}

export default imports
