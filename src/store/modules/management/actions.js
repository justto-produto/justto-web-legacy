const managementActions = {
  setActiveactiveOccurrency({ commit, state }, occurrency) {
    commit('setActiveOccurrency', state.activeOccurrency.id === occurrency.id ? {} : occurrency)
  }
}

export default managementActions
