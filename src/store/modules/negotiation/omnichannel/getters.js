import { stripHtml } from '@/utils'

const mapTabOccurrenceType = {
  MESSAGES: 'INTERACTION',
  NOTES: 'NOTE',
  OCCURRENCES: 'LOG'
}

const omnichannelGetters = {
  getActiveTab: state => (state.activeTab),
  getEditorConfig: state => (state.editor.configs),
  getEditorReady: state => (state.editor.ready),
  getEditorText: state => (state.editor.messageText),
  getNoteEditorText: state => (state.editor.noteText),
  getEditorTextScaped: state => stripHtml(state.editor.messageText),
  getEditorMessageType: state => (state.editor.messageType),
  getOccurrencesList: state => (state.occurrences.list),
  getOccurrencesFilter: state => ({
    ...state.occurrences.filter,
    type: mapTabOccurrenceType[state.activeTab]
  }),
  getFullMessages: state => (state.occurrences.fullMessages)
}

export default omnichannelGetters
