import Vue from 'vue'

const personMutations = {
  setLoggedPerson(state, loggedPerson) {
    Vue.set(state, 'loggedPerson', loggedPerson)
    localStorage.setItem('jusperson', JSON.stringify(loggedPerson))
  },
  clearLoggedPerson(state) {
    state.loggedPerson = {}
  }
}

export default personMutations
