const omnichannelActions = {
  setActiveTab({ commit }, tab) {
    commit('setActiveTab', tab)
  },
  setEditorReady({ commit }, isRedy) {
    commit('setEditorReady', isRedy)
  },
  setEditorText({ commit }, message) {
    commit('setEditorText', message)
  },
  setNoteEditorText({ commit }, note) {
    commit('setNoteEditorText', note)
  },
  setMessageType({ commit }, type) {
    commit('setMessageType', type)
  }
}

export default omnichannelActions
