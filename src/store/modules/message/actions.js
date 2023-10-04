import { axiosDispatch, extractMentions } from '@/utils'

const messagesPath = 'api/messages'

const messageActions = {
  canSendWhatsapp(_, phone) {
    return axiosDispatch({ url: `api/messages/can-send/${phone}` })
  },

  sendwhatsapp(_, data) {
    return axiosDispatch({
      url: `${messagesPath}/send/whatsapp`,
      method: 'post',
      data: data
    })
  },

  sendemail(_, data) {
    return axiosDispatch({
      url: `${messagesPath}/send/email`,
      method: 'post',
      data: { ...data, mentionedPeople: extractMentions(data.message) }
    })
  },

  sendNegotiator(_, params) {
    const { disputeId, data } = params
    return axiosDispatch({
      url: `api/negotiations/${disputeId}/messages`,
      method: 'POST',
      data: { ...data, mentionedPeople: extractMentions(data.message) },
      action: 'SOCKET_ADD_OCCURRENCE'
    })
  },

  getOccurrenceMessage(_, messageId) {
    return axiosDispatch({
      url: `${messagesPath}/${messageId}`
    })
  },

  getQuickReplyTemplates(_, disputeId) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/${disputeId}`,
      mutation: 'setQuickReplyTemplates'
    })
  },

  editQuickReplyTemplate(_, { template, disputeId }) {
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

  editTemplate(_, { template, disputeId }) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/${disputeId}/template`,
      method: 'put',
      data: template
    })
  },

  getMessageToPreview(_, { template, disputeId }) {
    return axiosDispatch({
      url: `${messagesPath}/quick-reply/preview/${disputeId}`,
      method: 'POST',
      data: {
        value: template
      },
      mutation: 'setMessageToPreview'
    })
  },

  setShowPreview({ commit }, visibility) {
    return new Promise(resolve => {
      commit('setShowPreview', visibility)
      resolve()
    })
  },

  requestBuyDialers(_, data) {
    return axiosDispatch({
      url: `${messagesPath}/email/send`,
      method: 'POST',
      data
    })
  },

  sendCustomEmail(_, data) {
    return axiosDispatch({
      url: `${messagesPath}/email/send`,
      method: 'POST',
      data
    })
  },

  setMessageBackup({ commit }, backup) {
    commit('setMessageBackup', backup)
  }
}

export default messageActions
