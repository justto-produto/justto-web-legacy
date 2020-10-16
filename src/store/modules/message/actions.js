import axiosDispatcher from '@/store/axiosDispatcher'

const actions = {
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
      url: `/api/messages/quick-reply/template/${templateId}/archive`,
      method: 'patch'
    }).then(() => commit('archiveQuickReplyTemplate', templateId))
  },
  editTemplate({ _ }, { template, disputeId }) {
    return axiosDispatcher({
      url: `/api/messages/quick-reply/${disputeId}/template`,
      method: 'put',
      data: template
    })
  }
}

export default actions
