import { axiosDispatch } from '@/utils'

const messagesPath = 'api/messages'

const messageActions = {
  canSendWhatsapp({ _ }, phone) {
    return axiosDispatch({ url: `api/messages/can-send/${phone}` })
  },
  sendwhatsapp({ _ }, data) {
    return axiosDispatch({
      url: `${messagesPath}/send/whatsapp`,
      method: 'post',
      data: data
    })
  },
  sendemail({ _ }, data) {
    return axiosDispatch({
      url: `${messagesPath}/send/email`,
      method: 'post',
      data: data
    })
  },
  sendNegotiator({ _ }, params) {
    const { disputeId, data } = params
    return axiosDispatch({
      url: `api/negotiations/${disputeId}/messages`,
      method: 'POST',
      data,
      mutation: 'SOCKET_ADD_OCCURRENCE'
    })
  },
  getOccurrenceMessage({ _ }, messageId) {
    return axiosDispatch({
      url: `${messagesPath}/${messageId}`
    })
  },
  getQuickReplyTemplates({ _ }, disputeId) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/${disputeId}`,
      mutation: 'setQuickReplyTemplates'
    })
  },
  editQuickReplyTemplate({ commit }, { template, disputeId }) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/${disputeId}/template`,
      method: 'PUT',
      data: template
    })
    // .then(() => commit('editQuickReplyTemplate', template))
  },
  resetQuickReplyTemplate({ dispatch }, { templateId, disputeId }) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/template/${templateId}`,
      method: 'DELETE'
    }).then(() => dispatch('getQuickReplyTemplates', disputeId)).then(_ => {})
  },
  archiveQuickReplyTemplate({ commit }, templateId) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/template/${templateId}/archive`,
      method: 'patch'
    }).then(() => commit('archiveQuickReplyTemplate', templateId))
  },
  editTemplate({ _ }, { template, disputeId }) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/${disputeId}/template`,
      method: 'put',
      data: template
    })
  }
}

export default messageActions
