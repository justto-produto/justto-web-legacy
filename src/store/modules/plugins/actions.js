const pluginsAction = {
  toggleImageUploadDialog({ state: { showImageUploadDialog }, commit }, visibility = false) {
    commit('setImageUploadVisibility', visibility || !showImageUploadDialog)
  },

  saveImageInBucket({ _ }, { file }) {
    // console.log(file)

    return new Promise((resolve) => {
      setTimeout(() => resolve({ url: 'https://storage.googleapis.com/justto_app/emails/logo-justto-email.png' }), 1000)
    })
  }
}

export default pluginsAction
