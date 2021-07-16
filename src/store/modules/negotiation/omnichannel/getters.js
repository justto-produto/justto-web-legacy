import { stripHtml } from '@/utils'

const mapTabOccurrenceType = {
  MESSAGES: 'INTERACTION',
  NOTES: 'NOTE',
  OCCURRENCES: 'LOG'
}

const omnichannelGetters = {
  getActiveTab: state => (state.activeTab),
  isOccurrencesLoading: state => (state.countOmnichannelGetters > 0),
  getExportTicketModalVisible: state => state.exportTicketModalVisible,

  // EDITOR
  getEditorText: state => (state.editor.messageText),
  getNoteEditorText: state => (state.editor.noteText),
  getEditorRecipients: state => (state.editor.recipients),
  getEditorMessageType: state => (state.editor.messageType),
  getRecentWhatsappMessages: state => (state.editor.recentMessages),
  getEditorTextScaped: state => stripHtml(state.editor.messageText),
  getSelectedAttachments: state => state.editor.attachments,

  // OCCURRENCES
  getOccurrencesList: state => (state.occurrences.list),
  getFullMessages: state => (state.occurrences.fullMessages),
  getOccurrencesSummary: state => (state.occurrences.summary),
  getTotalOccurrences: state => (state.occurrences.totalElements),
  getOccurrencesSummaryKeys: state => ({
    SMS: Object.keys(state.occurrences.summary.SMS).map(Number),
    EMAIL: Object.keys(state.occurrences.summary.EMAIL).map(Number),
    WHATSAPP: Object.keys(state.occurrences.summary.WHATSAPP).map(Number)
  }),
  getOccurrencesFilter: state => ({
    ...state.occurrences.filter,
    type: mapTabOccurrenceType[state.activeTab]
  }),
  getDisputeProtocol: state => (state.disputeProtocol)
}

export default omnichannelGetters
