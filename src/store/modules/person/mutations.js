const personMutations = {
  setLoggedPerson(state, loggedPerson) {
    state.loggedPerson = loggedPerson
    localStorage.setItem('jusperson', JSON.stringify(loggedPerson))
  },
  clearLoggedPerson(state) {
    state.loggedPerson = {}
  }
}

export default personMutations
