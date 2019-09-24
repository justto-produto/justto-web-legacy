import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const localWorkspace = JSON.parse(localStorage.getItem('jusworkspace'))
const person = localWorkspace && localWorkspace.person ? localWorkspace.person : {}

const personModule = {
  state: {
    loggedPerson: person
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default personModule
