import moment from 'moment'

import { approximateDate } from '@/utils'

const gettersNotifications = {
  notifications: (state) => state.notifications,
  mentionNotifications: (state) => state.mentionNotifications,
  mentionNotificationsGroupped: ({ mentionNotifications }) => {
    return mentionNotifications.content.reduce((acc, mention) => {
      const date = approximateDate(mention.createdAt.split('T')[0])

      acc[date] = [...(acc[date] || []), mention]
      return acc
    }, {})
  },
  mentionNotificationsFilter: state => ({
    page: state.mentionNotifications.pageable.pageNumber + 1,
    read: state.seeMentionsReaded
  }),
  mentionsOnlyRead: (state) => state.seeMentionsReaded,
  notificationsNotEmptyDisputes: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0),
  qtdThamirisPendingAlerts: ({ notifications }) => notifications.filter(({ quantity }) => quantity > 0).length,
  qtdMentionsPending: ({ mentionNotificationsSummary: { unread } }) => Number(unread),
  qtdNotifications: ({ notifications, mentionNotificationsSummary: { unread = 0 } }) => notifications.filter(({ quantity }) => quantity > 0).length + unread,
  areThamirisAlertsVisible: ({ thamirisAlertVisible }) => Boolean(thamirisAlertVisible),
  areNotificationsVisible: ({ notificationsVisible }) => notificationsVisible,
  notificationHoursDiff: () => {
    return moment().diff(moment(localStorage.getItem('jusAlertsLastView')), 'hours')
  }
}

export default gettersNotifications
