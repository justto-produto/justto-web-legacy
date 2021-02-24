import { axiosDispatch } from '@/utils'

import route from '@/router'

const disputeApi = 'api/disputes/v2'

const omnichannelActions = {
  setActiveTab({ commit, dispatch }, tab) {
    commit('setActiveTab', tab)

    if (route.currentRoute.params?.id) {
      const { id } = route.currentRoute.params
      dispatch('getOccurrences', id)
    }
  },

  setEditorReady({ commit }, isRedy) {
    commit('setEditorReady', isRedy)
  },

  setEditorText({ commit }, message) {
    commit('setEditorText', message)
  },

  setNoteEditorText({ commit }, note) {
    commit('setNoteEditorText', note)
  },

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
    const messagesPath = 'api/messages'
    if (messageId) {
      return axiosDispatch({
        url: `${messagesPath}/${messageId}`,
        mutation: 'addFullMessage'
      })
    }
  },

  deleteFullMessage({ commit }, messageId) {
    commit('removeFullMessage', messageId)
  },

  deleteTicketNote({ _ }, id) {
    return axiosDispatch({
      url: `${disputeApi}/note/${id}`,
      method: 'DELETE'
    })
  },

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

  resetRecipients({ commit }) {
    commit('resetRecipients')
  },

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
      message: type === 'whatsapp' ? messageText.trim() : messageEmail,
      to: getEditorRecipients.map(({ address }) => ({ address, roleId }))
    }

    if (type === 'email') {
      return dispatch('sendemail', data)
    } else if (type === 'whatsapp') {
      return dispatch('sendwhatsapp', data)
    } else if (type === 'negotiation') {
      return dispatch('sendNegotiator', { disputeId, data })
    }
  }
}

export default omnichannelActions
