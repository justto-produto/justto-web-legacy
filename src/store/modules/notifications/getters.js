const gettersNotifications = {
  notifications: (state) => state.notifications,
  // notifications: (state) => [
  //   {
  //     name: 'Esperando você responder',
  //     quantity: 750,
  //     tab: 'ENGAGEMENT',
  //     type: 'PENDING',
  //     filter: {
  //       prescriptions: 'PENDING'
  //     }
  //   },
  //   {
  //     name: 'Aguardando resposta da parte',
  //     quantity: 25,
  //     tab: 'ENGAGEMENT',
  //     type: 'PENDING',
  //     filter: {
  //       prescriptions: 'PENDING'
  //     }
  //   },
  //   {
  //     name: 'Sem resposta mas que possuem mensagens agendadas',
  //     quantity: 1800,
  //     tab: 'ENGAGEMENT',
  //     type: 'PENDING',
  //     filter: {
  //       prescriptions: 'PENDING'
  //     }
  //   },
  //   {
  //     name: 'C. Propostas(s) acima de 20% da alçada',
  //     quantity: 0,
  //     tab: 'ENGAGEMENT',
  //     type: 'PENDING',
  //     filter: {
  //       prescriptions: 'PENDING'
  //     }
  //   },
  //   {
  //     name: 'Teste testando',
  //     quantity: 25,
  //     tab: 'ENGAGEMENT',
  //     type: 'PENDING',
  //     filter: {
  //       prescriptions: 'PENDING'
  //     }
  //   },
  //   {
  //     name: 'C. Proposta(s) até 20% da alçada',
  //     quantity: 100,
  //     tab: 'ENGAGEMENT',
  //     type: 'PENDING',
  //     filter: {
  //       prescriptions: 'PENDING'
  //     }
  //   }
  // ],
  notificationsNotEmptyDisputes: ({ notifications }) => notifications.filter(n => n.quantity !== 0),
  qtdNotifications: ({ notifications }) => notifications.length,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => thamirisAlertVisible,
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible
}

export default gettersNotifications
