const pluginsMutations = {
  setImageUploadVisibility: (state, visibility) => {
    state.showImageUploadDialog = Boolean(visibility)
  }
}

export default pluginsMutations
