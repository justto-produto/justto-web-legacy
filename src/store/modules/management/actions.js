const ManagementActions = {
  setActiveactiveOccurrency({ commit }, occurrency) {
    console.log('setActiveOccurrency', occurrency)
    commit('setActiveOccurrency', occurrency)
  }
}

export default ManagementActions
