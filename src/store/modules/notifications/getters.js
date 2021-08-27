import moment from 'moment'

const gettersNotifications = {
  notifications: (state) => state.notifications,
  mentionNotifications: (state) => state.mentionNotifications,
  notificationsNotEmptyDisputes: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0),
  qtdThamirisPendingAlerts: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0).length,
  qtdMentionsPending: ({ mentionNotificationsSummary: { unread } }) => Number(unread),
  qtdNotifications: ({ notifications, mentionNotificationsSummary: { unread } }) => notifications.filter(({ quantity }) => quantity > 0).length + unread,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => Boolean(thamirisAlertVisible),
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible,
  notificationHoursDiff: () => {
    return moment().diff(moment(localStorage.getItem('jusAlertsLastView')), 'hours')
  }
}

export default gettersNotifications
