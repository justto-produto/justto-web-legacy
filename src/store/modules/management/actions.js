const managementActions = {
  setActiveactiveOccurrency({ commit, state }, occurrency) {
    commit('setActiveOccurrency', state.activeOccurrency.id === occurrency.id ? {} : occurrency)
  },
  setSelectedIds({ commit }, ids) {
    commit('setSelectedIds', ids)
  }
}

export default managementActions
