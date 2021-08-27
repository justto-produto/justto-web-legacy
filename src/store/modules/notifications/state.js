const stateNotifications = {
  notifications: [],
  mentionNotifications: {
    content: [],
    pageable: {
      pageNumber: 0
    }
  },
  mentionNotificationsSummary: {
    timestamp: null,
    total: 0,
    unread: 0
  },
  thamirisAlertVisible: false,
  notificationsVisible: false
}

export default stateNotifications
