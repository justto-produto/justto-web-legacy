import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const person = JSON.parse(localStorage.getItem('jusperson')) || {}

const personModule = {
  state: {
    loggedPerson: person,
    onlineDocuments: {}
  },
  mutations,
  actions,
  getters
}

export default personModule
