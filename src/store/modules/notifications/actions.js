import { axiosDispatch, buildQuery } from '@/utils/'

const urlBase = '/api/disputes/v2'
const mentionsUrl = '/api/disputes/mention'

const actionsNotifications = {
  getThamirisAlerts({ _ }) {
    return axiosDispatch({
      url: `${urlBase}/todo/list`,
      mutation: 'setNotifications',
      action: 'getMentionsSummary'
    })
  },

  getMentions({ getters: { mentionNotificationsFilter } }, command = '') {
    const filters = command === 'nextPage' ? {
      ...mentionNotificationsFilter,
      page: mentionNotificationsFilter.page + 1
    } : {}

    return axiosDispatch({
      url: `${mentionsUrl}${buildQuery(filters)}`,
      mutation: 'setMentions'
    })
  },

  getMentionsSummary({ _ }) {
    return axiosDispatch({
      url: `${mentionsUrl}/summary`,
      mutation: 'setMentionsSummary',
      action: 'getMentions'
    })
  },

  setNotificationsVisible({ commit }, visibility) {
    commit('setNotificationsVisible', visibility)
  },

  setMentionReaded({ _ }, mentionId) {
    return axiosDispatch({
      url: `${mentionsUrl}/${mentionId}/read`,
      method: 'PATCH'
    })
  },

  SOCKET_ADD_NOTIFICATIONS({ _ }, notification) {
    console.log('SOCKET_ADD_NOTIFICATIONS', notification)
  }
}

export default actionsNotifications
