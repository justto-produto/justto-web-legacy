const getters = {
  workspaceTags: state => state.workspaceTags.filter(t => !t.archived),
  disputeTags: state => state.disputeTags
}

export default getters
