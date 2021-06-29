const gettersNotifications = {
  notifications: (state) => {
    return state.notifications
  },
  notificationsNotEmptyDisputes: ({ notifications }) => notifications.filter(n => n.quantity !== 0),
  qtdNotifications: ({ notifications }) => notifications.length,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => thamirisAlertVisible,
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible
}

export default gettersNotifications
