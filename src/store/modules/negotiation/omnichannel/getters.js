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
  getEditorRecipients: state => (state.editor.recipients),
  getEditorTextScaped: state => stripHtml(state.editor.messageText),
  getEditorMessageType: state => (state.editor.messageType),
  getOccurrencesList: state => (state.occurrences.list),
  getOccurrencesSummary: state => (state.occurrences.summary),
  getOccurrencesSummaryKeys: state => ({
    SMS: Object.keys(state.occurrences.summary.SMS).map(Number),
    EMAIL: Object.keys(state.occurrences.summary.EMAIL).map(Number),
    WHATSAPP: Object.keys(state.occurrences.summary.WHATSAPP).map(Number)
  }),
  getOccurrencesFilter: state => ({
    ...state.occurrences.filter,
    type: mapTabOccurrenceType[state.activeTab]
  }),
  getFullMessages: state => (state.occurrences.fullMessages)
}

export default omnichannelGetters
