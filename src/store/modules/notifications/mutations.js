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
        if (moment().diff(moment(localStorage.getItem('jusAlertsLastView')), 'hours') > 3) {
          setValueThamirisAlert(state, true)
        }
      } else {
        setValueThamirisAlert(state, true)
      }
    }

    Vue.set(state, 'notifications', notifications)
  },

  hideThamirisAlerts: (state, _data) => {
    setValueThamirisAlert(state, false)
  },

  toggleShowNotifications: (state, open) => {
    setValueThamirisAlert(state, open)
  }
}

export default mutationsNotifications
