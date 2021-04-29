import { stripHtml } from '@/utils'

const mapTabOccurrenceType = {
  MESSAGES: 'INTERACTION',
  NOTES: 'NOTE',
  OCCURRENCES: 'LOG'
}

const omnichannelGetters = {
  getActiveTab: state => (state.activeTab),
  getEditorReady: state => (state.editor.ready),
  getEditorConfig: state => (state.editor.configs),
  getEditorText: state => (state.editor.messageText),
  getNoteEditorText: state => (state.editor.noteText),
  getOccurrencesList: state => ([
    ...state.occurrences.list,
    {
      id: 1641311000,
      createAt: { dateTime: '2021-04-16T20:57:23Z', javaDate: false },
      updateAt: null,
      archived: false,
      disputeId: 185189,
      description: 'Avaliação do NPS.',
      type: 'INTERACTION',
      executionDateTime: { dateTime: '2021-04-16T20:57:23Z', javaDate: false },
      status: 'RUNNING',
      interaction: {
        id: 1037392800,
        createAt: { dateTime: '2021-04-16T20:57:23Z', javaDate: false },
        updateAt: null,
        archived: false,
        message: {
          trackerToken: 'ABGHVRKYgmEEPwIKPrAyCm7_mcDXsw',
          messageId: 5843878,
          title: null,
          receiver: null,
          resume: 'Comentário do NPS',
          createdBy: 'system',
          sender: 'deivid@justto.com.br',
          communicationType: 'NPS',
          status: 'PROCESSED',
          contentType: 'TEXT',
          scheduledTime: { dateTime: null, javaDate: false },
          parameters: {
            SENDER_NAME: '551288261043',
            NPS_STARS: 4,
            NPS_REASONS: 'ATENDIMENTO, ALÇADA INSUFICIENTE',
            NPS_REPLY: ''
          },
          archived: false
        },
        type: 'NPS',
        direction: 'INBOUND',
        properties: { PERSON_NAME: 'LUCAS ISRAEL AMANCIO DA SILVA' }
      },
      properties: { GROUPED_OCCURRENCES: '[]' },
      messageId: '16413110'
    }
  ]),
  getEditorRecipients: state => (state.editor.recipients),
  getEditorMessageType: state => (state.editor.messageType),
  getFullMessages: state => (state.occurrences.fullMessages),
  getOccurrencesSummary: state => (state.occurrences.summary),
  getRecentWhatsappMessages: state => (state.editor.recentMessages),
  getTotalOccurrences: state => (state.occurrences.totalElements),
  getEditorTextScaped: state => stripHtml(state.editor.messageText),
  isOccurrencesLoading: state => (state.countOmnichannelGetters > 0),
  getExportTicketModalVisible: state => state.exportTicketModalVisible,
  getOccurrencesSummaryKeys: state => ({
    SMS: Object.keys(state.occurrences.summary.SMS).map(Number),
    EMAIL: Object.keys(state.occurrences.summary.EMAIL).map(Number),
    WHATSAPP: Object.keys(state.occurrences.summary.WHATSAPP).map(Number)
  }),
  getOccurrencesFilter: state => ({
    ...state.occurrences.filter,
    type: mapTabOccurrenceType[state.activeTab]
  }),
  getSelectedAttachments: state => state.editor.attachments
}

export default omnichannelGetters
