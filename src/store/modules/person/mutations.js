const mutations = {
  setLoggedPerson (state, loggedPerson) {
    if (loggedPerson) state.loggedPerson = loggedPerson
  },
  clearLoggedPerson (state) {
    state.loggedPerson = {}
  }
}

export default mutations
