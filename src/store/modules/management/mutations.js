const managementMutations = {
  setActiveOccurrency: (state, activeOccurrency) => (state.activeOccurrency = activeOccurrency),
  setSelectedIds: (state, ids) => {
    state.selectedIds = [...ids]
  }
}

export default managementMutations
