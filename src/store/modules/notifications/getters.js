const gettersNotifications = {
  // notifications: (state) => state.notifications,
  notifications: (state) => [{
    name: 'Pendentes',
    quantity: 0,
    tab: 'ENGAGEMENT',
    type: 'PENDING',
    filter: {
      prescriptions: 'PENDING'
    }
  }],
  qtdNotifications: ({ notifications }) => notifications.length,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => thamirisAlertVisible,
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible
}

export default gettersNotifications
