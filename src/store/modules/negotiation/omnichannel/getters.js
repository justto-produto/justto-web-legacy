const omnichannelGetters = {
  getActiveTab: state => {
    return state.activeTab
  },
  getEditorConfig: state => {
    return state.editor.configs
  },
  getEditorReady: state => {
    return state.editor.ready
  },
  getEditorText: state => {
    return state.editor.text
  },
  getEditorMessageType: state => {
    return state.editor.messageType
  }
}

export default omnichannelGetters
