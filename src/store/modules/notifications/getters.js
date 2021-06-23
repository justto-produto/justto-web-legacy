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
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => thamirisAlertVisible
}

export default gettersNotifications
