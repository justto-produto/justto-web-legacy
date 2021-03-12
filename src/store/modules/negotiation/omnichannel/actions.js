import { axiosDispatch, isSimilarStrings, buildQuery } from '@/utils'

import route from '@/router'

const disputeApi = 'api/disputes/v2'
const messagesPath = 'api/messages'

const omnichannelActions = {
  setOmnichannelActiveTab({ commit, dispatch }, tab) {
    commit('setOmnichannelActiveTab', tab)
    commit('resetRecipients')
    commit('resetOccurrences')

    if (route.currentRoute.params?.id) {
      const { id } = route.currentRoute.params
      dispatch('getOccurrences', id)
    }
  },

  setEditorReady: ({ commit }, isRedy) => commit('setEditorReady', isRedy),

  setEditorText: ({ commit }, message) => commit('setEditorText', message),

  setNoteEditorText: ({ commit }, note) => commit('setNoteEditorText', note),

  setMessageType({ commit }, type) {
    commit('setMessageAttachments', [])
    commit('setMessageType', type)
    commit('resetRecipients')
  },

  getOccurrences({ getters }, disputeId) {
    const params = {
      ...getters.getOccurrencesFilter,
      type: getters.getOccurrencesFilter.type === 'LOG' ? null : getters.getOccurrencesFilter.type
    }

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/occurrences${buildQuery(params)}`,
      mutation: 'setOccurrences'
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
    const { type, value } = recipient
    const { getEditorMessageType, getEditorRecipients } = getters

    if (getEditorRecipients.find(el => el.value === value)) {
      commit('removeRecipient', value)
    } else {
      if (getEditorMessageType !== type && value) dispatch('setMessageType', type)
      if (type === 'whatsapp') commit('resetRecipients')
      if (value) commit('setRecipients', recipient)
    }
  },

  resetRecipients: ({ commit }) => commit('resetRecipients'),

  resetOccurrences: ({ commit }) => commit('resetOccurrences'),

  sendMessage({ dispatch, getters }, disputeId) {
    const {
      getTicketOverviewNegotiators: negotiators,
      getSelectedAttachments: attachments,
      getEditorTextScaped: messageText,
      getEditorRecipients: recipients,
      getEditorText: messageEmail,
      getEditorMessageType: type
    } = getters

    const roleId = negotiators[0].disputeRoleId
    const to = recipients.map(({ value, key }) => ({ [key]: value }))
    const externalIdentification = +new Date()

    if (type === 'email') {
      const data = {
        to,
        disputeId,
        attachments,
        message: messageEmail,
        externalIdentification
      }
      return dispatch('sendemail', data)
    } else if (type === 'whatsapp') {
      const data = {
        to,
        disputeId,
        externalIdentification,
        message: messageText.trim()
      }
      return dispatch('validateWhatsappMessage', { data, contact: recipients[0].value })
    } else {
      const data = {
        roleId,
        message: messageEmail,
        email: recipients[0].value
      }
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
  },

  setMessageAttachments({ commit }, attachs) {
    commit('setMessageAttachments', attachs || [])
  },

  SOCKET_ADD_OCCURRENCE({ commit }, occurrence) {
    if (window.location.href.includes('negotiation')) {
      commit('addNegotiationOccurrence', occurrence)
    }
    if (window.location.href.includes('dispute')) {
      commit('addDisputeOccurrence', occurrence)
    }
  }
}

export default omnichannelActions
