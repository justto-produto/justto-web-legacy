const tagGetters = {
  workspaceTags: state => state.workspaceTags.filter(t => !t.archived),
  disputeTags: state => state.disputeTags,
  filteredTags: state => state.filteredTags,
  getTagsColors: ({ colors }) => colors,
  getTagsIcons: ({ icons }) => icons
}

export default tagGetters
