import axiosDispatcher from '@/store/axiosDispatcher.js'

const message = {
  state: {
    recentMessages: [],
    messageResumes: [],
    quickReplyTemplates: []
  },
  mutations: {
    addMessageResume: (state, messageResume) => (state.messageResumes.push(messageResume)),
    deleteMessageResumeByDisputeId(state, disputeId) {
      const index = state.messageResumes.findIndex(mr => mr.disputeId === disputeId)
      if (index !== -1) state.messageResumes.splice(index, 1)
    },
    setQuickReplyTemplates: (state, templates) => (state.quickReplyTemplates = templates)
  },
  actions: {
    canSendWhatsapp({ _ }, phone) {
      return axiosDispatcher({ url: `api/messages/can-send/${phone}` })
    },
    sendwhatsapp({ _ }, data) {
      return axiosDispatcher({
        url: 'api/messages/send/whatsapp',
        method: 'post',
        data: data
      })
    },
    sendemail({ _ }, data) {
      return axiosDispatcher({
        url: 'api/messages/send/email',
        method: 'post',
        data: data
      })
    },
    getOccurrenceMessage({ _ }, messageId) {
      return axiosDispatcher({
        url: `api/messages/${messageId}`
      })
    },
    getQuickReplyTemplates({ _ }, disputeId) {
      return axiosDispatcher({
        url: `/api/messages/quick-reply/${disputeId}`,
        mutation: 'setQuickReplyTemplates'
      })
    },
    resetQuickReplyTemplate({ _ }, templateId) {
      return axiosDispatcher({
        url: `/api/messages/quick-reply/template/${templateId}`,
        method: 'DELETE'
      })
    },
    archiveQuickReplyTemplate({ _ }, templateId) {
      return axiosDispatcher({
        url: `/api/messages/quick-reply/template/${templateId}/archive`,
        method: 'PATCH'
      })
    }
  },
  getters: {
    messageRecentMessages: state => state.recentMessages,
    getMessageResumeByDisputeId: state => (disputeId) => {
      return state.messageResumes.find(mr => mr.disputeId === disputeId)
    },
    quickReplyTemplates: state => state.quickReplyTemplates
  }
}

export default message
