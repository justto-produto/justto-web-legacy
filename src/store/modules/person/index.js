import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const person = JSON.parse(localStorage.getItem('jusperson')) || {}

const personModule = {
  state: {
    loggedPerson: person,
    onlineDocuments: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default personModule
