import { stripHtml } from '@/utils'

const mapTabOccurrenceType = {
  MESSAGES: ['INTERACTION', 'NOTE', 'ACTION'],
  NOTES: 'NOTE',
  OCCURRENCES: 'LOG'
}

const dateKey = (occ) => {
  return occ.updateAt ? 'updateAt' : 'createAt'
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
  getTotalOccurrences: state => (state.totalOfOccurrences),
  getOccurrencesSummaryKeys: state => ({
    SMS: Object.keys(state.occurrences.summary.SMS).map(Number),
    EMAIL: Object.keys(state.occurrences.summary.EMAIL).map(Number),
    WHATSAPP: Object.keys(state.occurrences.summary.WHATSAPP).map(Number)
  }),
  getOccurrencesFilter: state => ({
    ...state.occurrences.filter,
    type: mapTabOccurrenceType[state.activeTab]
  }),
  getDisputeProtocol: state => (state.disputeProtocol),
  getUnansweredOccurrences: state => {
    const reverseOccurrences = [...state.occurrences.list].reverse()
    const firstOutboundDate = reverseOccurrences.find(occ => occ.interaction.direction !== 'INBOUND') || { createAt: { dateTime: new Date().toISOString() } }

    return reverseOccurrences.filter(occ => {
      return new Date(occ[dateKey(occ)].dateTime) > new Date(firstOutboundDate[dateKey(firstOutboundDate)].dateTime)
    })
  },

  getGroupedOccurrences: state => state.groupedOccurrences,

  getGroupedOccurrencesById: state => (id) => {
    return state.groupedOccurrences[id] || []
  }
}

export default omnichannelGetters
