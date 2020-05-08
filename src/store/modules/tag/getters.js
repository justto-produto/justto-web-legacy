const getters = {
  workspaceTags: state => state.workspaceTags.filter(t => !t.archived),
  disputeTags: state => state.disputeTags,
  filteredTags: state => state.filteredTags
}

export default getters
