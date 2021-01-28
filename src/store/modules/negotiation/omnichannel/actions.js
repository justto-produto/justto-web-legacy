import { axiosDispatch } from '@/utils'

import route from '@/router'

const baseUrl = 'api/disputes/v2'

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
    const params = getters.getOccurrencesFilter
    return axiosDispatch({
      url: `${baseUrl}/${disputeId}/occurrences`,
      mutation: 'setOccurrences',
      params
    })
  },
}

export default omnichannelActions
