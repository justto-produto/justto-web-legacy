import { axiosDispatch } from '@/utils/'

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

  getMentions({ getters: { mentionNotificationsFilter: { page, read } } }, command = '') {
    const filters = command === 'nextPage' ? {
      read: read ? false : null,
      page: page + 1
    } : {
      read: read ? false : null
    }

    return axiosDispatch({
      url: `${mentionsUrl}`,
      params: filters,
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
      method: 'PATCH',
      payload: { mentionId },
      mutation: 'setMentionReaded'
    })
  },

  SOCKET_ADD_NOTIFICATIONS({ _ }, notification) {
    console.log('SOCKET_ADD_NOTIFICATIONS', notification)
  },

  SOCKET_NOTIFY_MENTION_SUMMARY({ _ }, mention) {
    console.log('SOCKET_NOTIFY_MENTION_SUMMARY', mention)
  }
}

export default actionsNotifications
