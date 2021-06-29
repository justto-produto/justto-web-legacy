const gettersNotifications = {
  notifications: (state) => {
    return state.notifications
  },
  notificationsNotEmptyDisputes: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0),
  qtdNotifications: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0).length,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => thamirisAlertVisible,
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible
}

export default gettersNotifications
