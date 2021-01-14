const omnichannelActions = {
  setActiveTab({ commit }, tab) {
    commit('setActiveTab', tab)
  },
  setEditorReady({ commit }, value) {
    commit('setEditorReady', value)
  },
  setEditorText({ commit }, text) {
    commit('setEditorText', text)
  },
  setMessageType({ commit }, type) {
    commit('setMessageType', type)
  }
}

export default omnichannelActions
