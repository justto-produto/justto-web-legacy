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
  },
  getOccurrences({ getters }, disputeId) {
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
      url: `${disputeApi}/note/${id}`,
      method: 'PUT',
      data: { disputeId, note }
    })
  }
}

export default omnichannelActions
