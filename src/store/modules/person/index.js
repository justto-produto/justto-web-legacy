import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const localPerson = JSON.parse(localStorage.getItem('jusperson'))
const person = localPerson ? localPerson : {}

const personModule = {
  state: {
    loggedPerson: person
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default personModule
