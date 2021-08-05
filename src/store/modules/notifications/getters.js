import moment from 'moment'

const gettersNotifications = {
  notifications: (state) => {
    return state.notifications
  },
  notificationsNotEmptyDisputes: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0),
  qtdNotifications: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0).length,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => thamirisAlertVisible,
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible,
  notificationDiff: () => {
    return moment().diff(moment(localStorage.getItem('jusAlertsLastView')), 'hours')
  }
}

export default gettersNotifications
