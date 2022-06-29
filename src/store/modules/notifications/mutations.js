import Vue from 'vue'
import moment from 'moment'
import Notification from '@/models/notifications/Notification'

function setValueThamirisAlert(state, value) {
  Vue.set(state, 'thamirisAlertVisible', value)

  if (value) {
    const now = moment().format()
    localStorage.setItem('jusAlertsLastView', now)
  }
}

const mutationsNotifications = {
  setNotifications: (state, data) => {
    const notifications = (data.data ? data.data : data)
      .map(notification => new Notification(notification))

    if (notifications.length !== 0) {
      const jusAlertsLastView = localStorage.getItem('jusAlertsLastView')

      if (jusAlertsLastView) {
        if (moment().diff(moment(localStorage.getItem('jusAlertsLastView')), 'hours') >= 3) {
          setValueThamirisAlert(state, true)
        }
      } else {
        setValueThamirisAlert(state, true)
      }
    }

    Vue.set(state, 'notifications', notifications)
  },

  setMentions: (state, mentions) => {
    const { number, content } = mentions

    Vue.set(state, 'mentionNotifications', {
      ...mentions,
      content: number > 0 ? [...state.mentionNotifications.content, ...content] : content
    })
  },

  setMentionsSummary: (state, data) => Vue.set(state, 'mentionNotificationsSummary', data),

  hideThamirisAlerts: (state, _data) => {
    setValueThamirisAlert(state, false)
  },

  toggleShowNotifications: (state, open) => {
    setValueThamirisAlert(state, open)
    state.notificationsVisible = false
  },

  setNotificationsVisible: (state, visibility) => {
    state.notificationsVisible = visibility
  },

  setMentionReaded: (state, { payload: { mentionId } }) => {
    state.mentionNotifications.content.forEach((item, index) => {
      if (Number(item.id) === Number(mentionId)) {
        Vue.set(state.mentionNotifications.content[index], 'readDate', new Date().getTime())
      }
    })
  },

  setMentionsOnlyRead(state, onlyRead) {
    Vue.set(state, 'seeMentionsReaded', onlyRead)
  }
}

export default mutationsNotifications
