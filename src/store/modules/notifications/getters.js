const gettersNotifications = {
  // notifications: (state) => state.notifications,
  notifications: (state) => [
    {
      name: 'Pendentes',
      quantity: 0,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Teste testando',
      quantity: 25,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Essa é uma mussum ipsum grande loren descrição',
      quantity: 0,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Pendentes',
      quantity: 12,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Teste testando',
      quantity: 25,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Essa é uma mussum ipsum grande loren descrição',
      quantity: 100,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Pendentes',
      quantity: 12,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Teste testando',
      quantity: 25,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    },
    {
      name: 'Essa é uma mussum ipsum grande loren descrição',
      quantity: 100,
      tab: 'ENGAGEMENT',
      type: 'PENDING',
      filter: {
        prescriptions: 'PENDING'
      }
    }
  ],
  notificationsNotEmptyDisputes: ({ notifications }) => notifications.filter(n => n.quantity !== 0),
  qtdNotifications: ({ notifications }) => notifications.length,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => thamirisAlertVisible,
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible
}

export default gettersNotifications
