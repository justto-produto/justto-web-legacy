const mutations = {
  setWorkspaceTags (state, tags) {
    state.workspaceTags = tags.content
  },
  setDisputeTags (state, tags) {
    state.disputeTags = tags
  }
}

export default mutations
