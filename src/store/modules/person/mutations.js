const mutations = {
  setCurrentPerson (state, currentPerson) {
    if (currentPerson) state.currentPerson = currentPerson
  },
  clearCurrentPerson (state) {
    state.currentPerson = {}
  }
}

export default mutations
