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
    // editQuickReplyTemplate(state, template) {
    //   const index =  state.quickReplyTemplates.findIndex(t => t.template.id === template.id)
    //   state.quickReplyTemplates[index].template = template
    // },
    setQuickReplyTemplates: (state, templates) => (state.quickReplyTemplates = templates),
    archiveQuickReplyTemplate(state, templateId) {
      const index = state.quickReplyTemplates.findIndex(t => t.template.id === templateId)
      if (index !== -1) state.uickReplyTemplates.splice(index, 1)
    }
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
    editQuickReplyTemplate({ commit }, { template, disputeId }) {
      return axiosDispatcher({
        url: `/api/messages/quick-reply/${disputeId}/template`,
        method: 'PUT',
        data: template
      })
      // .then(() => commit('editQuickReplyTemplate', template))
    },
    resetQuickReplyTemplate({ dispatch }, { templateId, disputeId }) {
      return axiosDispatcher({
        url: `/api/messages/quick-reply/template/${templateId}`,
        method: 'DELETE'
      }).then(() => dispatch('getQuickReplyTemplates', disputeId))
    },
    archiveQuickReplyTemplate({ commit }, templateId) {
      return axiosDispatcher({
        url: `/api/messages/quick-reply/template/${templateId}`,
        method: 'delete'
      }).then(() => commit('archiveQuickReplyTemplate', templateId))
    },
    editTemplate({ _ }, { template, disputeId }) {
      return axiosDispatcher({
        url: `/api/messages/quick-reply/${disputeId}/template`,
        method: 'put',
        data: template
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
