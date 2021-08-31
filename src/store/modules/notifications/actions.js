import { axiosDispatch } from '@/utils/'

const urlBase = '/api/disputes/v2'
const mentionsUrl = '/api/disputes/mention'

function getMemberName({ workspaceMembers }, fromAccountId) {
  const member = workspaceMembers.find(({ accountId }) => Number(accountId) === Number(fromAccountId))

  return member?.person?.name || member?.accountEmail || ''
}

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
      page: page,
      sort: 'createdAt,desc'
    } : {
      read: read ? false : null,
      sort: 'createdAt,desc'
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

  SOCKET_NOTIFY_MENTION_SUMMARY({ dispatch }, _mention) {
    dispatch('getMentionsSummary')
  },

  SOCKET_ADD_MENTION({ dispatch, getters }, mention) {
    dispatch('getMentions')

    const audio = new Audio('https://storage.googleapis.com/justto_app/audio/NotificacaoJusttoApp.mp3')

    audio.play()

    const { disputeId, workspaceId, fromAccountId } = mention
    const vue = document.getElementById('app').__vue__

    vue.$notify({
      title: getMemberName(getters, fromAccountId),
      message: `Mencionou você #${disputeId}`,
      customClass: 'primary',
      duration: 5000,
      position: 'top-right',
      iconClass: 'el-icon-message-solid',
      onClick: () => vue.$router.push(`/redirect?wid=${workspaceId}&did=${disputeId}`)
    })
  }
}

export default actionsNotifications
