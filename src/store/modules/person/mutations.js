const mutations = {
  setLoggedPerson(state, loggedPerson) {
    state.loggedPerson = loggedPerson
    localStorage.setItem('jusperson', JSON.stringify(loggedPerson))
  },
  clearLoggedPerson(state) {
    state.loggedPerson = {}
  }
}

export default mutations
