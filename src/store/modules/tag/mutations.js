const mutations = {
  setWorkspaceTags(state, tags) {
    state.workspaceTags = tags.content
  },
  setDisputeTags(state, tags) {
    state.disputeTags = tags
  },
  setFilteredTags(state, tags) {
    state.filteredTags = tags.content
  }
}

export default mutations
