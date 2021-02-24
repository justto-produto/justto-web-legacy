import { axiosDispatch, isSimilarStrings } from '@/utils'

import route from '@/router'

const disputeApi = 'api/disputes/v2'
const messagesPath = 'api/messages'

const omnichannelActions = {
  setActiveTab({ commit, dispatch }, tab) {
    commit('setActiveTab', tab)

    if (route.currentRoute.params?.id) {
      const { id } = route.currentRoute.params
      dispatch('getOccurrences', id)
    }
  },

  setEditorReady: ({ commit }, isRedy) => commit('setEditorReady', isRedy),

  setEditorText: ({ commit }, message) => commit('setEditorText', message),

  setNoteEditorText: ({ commit }, note) => commit('setNoteEditorText', note),

  setMessageType({ commit }, type) {
    commit('setMessageType', type)
    commit('resetRecipients')
  },

  getOccurrences({ getters, commit }, disputeId) {
    commit('setOccurrences', { content: [] })
    const params = {
      ...getters.getOccurrencesFilter,
      type: getters.getOccurrencesFilter.type === 'LOG' ? null : getters.getOccurrencesFilter.type
    }
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/occurrences`,
      mutation: 'setOccurrences',
      params
    })
  },

  getFullMessage({ _ }, messageId) {
    if (messageId) {
      return axiosDispatch({
        url: `${messagesPath}/${messageId}`,
        mutation: 'addFullMessage'
      })
    }
  },

  deleteFullMessage: ({ commit }, messageId) => commit('removeFullMessage', messageId),

  cleanRecentMessages: ({ commit }) => commit('cleanRecentMessages'),

  deleteTicketNote: ({ _ }, id) => axiosDispatch({
    url: `${disputeApi}/note/${id}`,
    method: 'DELETE'
  }),

  saveTicketNote({ _ }, params) {
    const { disputeId, id, note } = params

    return axiosDispatch({
      url: `api/disputes/note/${id}`,
      method: 'PUT',
      data: { disputeId, note }
    })
  },

  getSummaryOccurrecies({ getters, commit }, { disputeId, communicationType, summaryRoleId, summaryOccurrenceId }) {
    const keys = getters.getOccurrencesSummaryKeys

    const payload = {
      type: communicationType,
      occurrenceId: summaryOccurrenceId
    }

    if (!keys[communicationType].includes(summaryOccurrenceId)) {
      return axiosDispatch({
        url: `${disputeApi}/${disputeId}/occurrences`,
        params: {
          summaryRoleId,
          communicationType,
          summaryOccurrenceId
        },
        mutation: 'addSumary',
        payload
      })
    } else {
      return new Promise((resolve, reject) => {
        commit('cleanSumary', payload)
        resolve()
      })
    }
  },

  addRecipient({ commit, dispatch, getters }, recipient) {
    if (getters.getEditorMessageType !== recipient.type) {
      dispatch('setMessageType', recipient.type)
    }
    commit('setRecipients', recipient)
  },

  resetRecipients: ({ commit }) => commit('resetRecipients'),

  sendMessage({ dispatch, getters }, disputeId) {
    const {
      getTicketOverviewNegotiators: negotiators,
      getEditorTextScaped: messageText,
      getEditorMessageType: type,
      getEditorText: messageEmail,
      getEditorRecipients
    } = getters

    const roleId = negotiators[0].disputeRoleId

    const data = type === 'negotiation' ? {
      roleId,
      message: messageEmail,
      email: getEditorRecipients[0].address
    } : {
      disputeId,
      externalIdentification: +new Date(),
      message: type === 'whatsapp' ? messageText.trim() : messageEmail,
      to: getEditorRecipients.map(({ address }) => ({ address }))
    }

    if (type === 'email') {
      return dispatch('sendemail', data)
    } else if (type === 'whatsapp') {
      return dispatch('validateWhatsappMessage', { data, contact: getEditorRecipients[0].address })
    } else if (type === 'negotiation') {
      return dispatch('sendNegotiator', { disputeId, data })
    }
  },

  validateWhatsappMessage({ commit, dispatch, getters }, { contact, data }) {
    return new Promise((resolve, reject) => {
      dispatch('canSendWhatsapp', contact).then(({ canSend }) => {
        if (canSend) {
          const can = getters.getRecentWhatsappMessages.filter(msg => isSimilarStrings(data.message, msg, 75)).length === 0
          if (can) {
            dispatch('sendwhatsapp', data).then(res => resolve(res))
          } else {
            commit('setEditorText', '')
            reject(JSON.stringify({
              title: 'Ops!',
              message: 'Parece que você enviou uma mensagem parecida recentemente.\nDevido às políticas de SPAM do WhatsApp, a mensagem não pôde ser enviada.',
              type: 'error'
            }))
          }
        } else {
          commit('resetRecipients')
          reject(JSON.stringify({
            title: 'Ops!',
            message: 'O envio de mensagem para este número WhatsApp não é permitido neste momento.\nO prazo para responder mensagens no WhatsApp é de 24 horas.\n\nNão encontramos uma mensagem deste número nas últimas 24 horas para que você possa responder.',
            type: 'error'
          }))
        }
      })
    })
  }
}

export default omnichannelActions
