import { stripHtml } from '@/utils'

const omnichannelGetters = {
  getActiveTab: state => (state.activeTab),
  getEditorConfig: state => (state.editor.configs),
  getEditorReady: state => (state.editor.ready),
  getEditorText: state => (state.editor.messageText),
  getNoteEditorText: state => (state.editor.noteText),
  getEditorTextScaped: state => stripHtml(state.editor.messageText),
  getEditorMessageType: state => (state.editor.messageType)
}

export default omnichannelGetters
