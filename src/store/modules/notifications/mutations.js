import Vue from 'vue'
import moment from 'moment'
import Notification from '@/models/notifications/Notification'

const mutationsNotifications = {
  setNotifications: (state, data) => {
    const notifications = (data.data ? data.data : data)
      .map(notification => new Notification(notification))

    if (notifications.length !== 0) {
      const jusAlertsLastView = localStorage.getItem('jusAlertsLastView')

      if (jusAlertsLastView) {
        if (moment().isAfter(moment(jusAlertsLastView, 'DD/MM/YYYY'), 'day')) {
          Vue.set(state, 'thamirisAlertVisible', true)
        }
      } else {
        Vue.set(state, 'thamirisAlertVisible', true)
      }
    }

    Vue.set(state, 'notifications', notifications)
  },

  hideThamirisAlerts: (state, _data) => {
    Vue.set(state, 'thamirisAlertVisible', false)
    const now = moment().format()
    localStorage.setItem('jusAlertsLastView', now)
  },

  toggleShowNotifications: (state, open) => {
    Vue.set(state, 'thamirisAlertVisible', open)
  }
}

export default mutationsNotifications
