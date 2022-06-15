<template>
  <article class="notification__drawer">
    <div
      slot="title"
      class="notification__drawer__header"
    >
      <div class="notification__drawer__header-label">
        <el-badge
          is-dot
          :hidden="qtdMentions <= 0"
        >
          Notificações
        </el-badge>

        <div class="notification__drawer__header-label-switch">
          {{ onlyRead ? 'Mostrar apenas não lidas' : 'Mostrar tudo' }}

          <i
            :class="{'el-icon-open active': onlyRead, 'el-icon-turn-off inactive': !onlyRead}"
            @click="onlyRead = !onlyRead"
          />
        </div>
      </div>
    </div>

    <div
      v-loading="loading"
      class="notification__drawer__list"
    >
      <div
        v-if="notifications.content.length"
        class="notification__drawer__list-top"
      >
        <div />
        <a
          class="notification__drawer__list-top-mark-as-readed"
          @click="setAllReaded"
        >
          Marcar tudo como lido
        </a>
      </div>

      <div class="notification__drawer__list-notifications">
        <div
          v-for="(notifications, date) in notificationsGrouped"
          :key="date"
          class="notification__drawer__list-notifications-item"
        >
          <div class="notification__drawer__list-item-date">
            {{ date | capitalize }}
          </div>

          <GroupedNotifications
            v-for="(fromAccountId) in filterAccountIds(notifications)"
            :key="`notification-from-${fromAccountId}`"
            :notifications="notificationsGroupedByDate(date, fromAccountId)"
            @openMention="openMention"
            @setReaded="setReaded"
          />
        </div>
      </div>

      <div class="notification__drawer__footer">
        <span
          v-if="!notifications.last"
          class="notification__drawer__footer-see-more"
          @click="seeNextpage()"
        >
          ver mais
        </span>

        <div class="notification__drawer__grayline" />

        <el-button
          class="notification__drawer__footer-button"
          type="text"
          @click="toggleShowNotifications"
        >
          <el-badge
            :value="qtdThamirisAlerts"
            :hidden="qtdThamirisAlerts <= 0"
          >
            <span>
              Ver lista de alertas
            </span>
          </el-badge>
        </el-button>
      </div>
    </div>
  </article>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { approximateTime, eventBus } from '@/utils'

import events from '@/constants/negotiationEvents'

const { SOCKET_NOTIFY_MENTION } = events

export default {
  components: {
    GroupedNotifications: () => import('./partials/GroupedNotifications')
  },

  data: () => ({
    loading: false
  }),

  computed: {
    ...mapGetters({
      mentionsOnlyRead: 'mentionsOnlyRead',
      notifications: 'mentionNotifications',
      notificationsGrouped: 'mentionNotificationsGroupped',
      notificationVisible: 'areNotificationsVisible',
      qtdThamirisAlerts: 'qtdThamirisPendingAlerts',
      mentions: 'mentionNotificationsGroupped',
      qtdMentions: 'qtdMentionsPending',
      members: 'workspaceMembers',
      width: 'getWindowWidth'
    }),

    getMemberName() {
      return (fromAccountId) => {
        if (fromAccountId === null) return 'JUSTTINE'
        const member = this.members.find(({ accountId }) => Number(accountId) === Number(fromAccountId))

        return member?.person?.name || member?.accountEmail || ''
      }
    },

    justtineUrl() {
      return require('@/assets/justtine/profile.png')
    },

    isVisible: {
      get() {
        return this.notificationVisible
      },

      set(visible) {
        if (visible) {
          this.loading = false
        }

        this.setVisibility(visible)
      }
    },

    onlyRead: {
      get() {
        return this.mentionsOnlyRead
      },

      set(value) {
        this.setMentionsOnlyRead(value)
        this.getMentionsSummary()
      }
    },

    parseDate() {
      return (date) => approximateTime(date)
    },

    countJusttineMentionByDay() {
      return Object.keys(this.mentions).reduce((acc, key) => {
        const accTemp = {}
        accTemp[key] = this.mentions[key].filter(({ fromAccountId }) => fromAccountId === null).length

        return { ...acc, ...accTemp }
      }, {})
    },

    notificationsGroupedByDate() {
      return (date, accountId) => {
        return this.notificationsGrouped[date].filter(({ fromAccountId }) => fromAccountId === accountId)
      }
    },

    filterAccountIds() {
      return notifications => notifications.reduce((acc, { fromAccountId }) => {
        return acc.includes(fromAccountId) ? acc : [...acc, fromAccountId]
      }, [])
    }
  },

  watch: {
    isVisible(visible) {
      this.getMentionsSummary()
    }
  },

  beforeMount() {
    eventBus.$off(SOCKET_NOTIFY_MENTION.callback, this.notifyMention)
    eventBus.$on(SOCKET_NOTIFY_MENTION.callback, this.notifyMention)
  },

  beforeDestroy() {
    eventBus.$off(SOCKET_NOTIFY_MENTION.callback, this.notifyMention)
  },

  methods: {
    ...mapActions({
      setTicketsFilters: 'setTicketsFilters',
      setTicketsActiveTab: 'setTicketsActiveTab',
      getTickets: 'getTickets',
      setVisibility: 'setNotificationsVisible',
      setMentionReaded: 'setMentionReaded',
      getMentionsSummary: 'getMentionsSummary',
      getMentions: 'getMentions'
    }),

    ...mapMutations({
      toggleShowNotifications: 'toggleShowNotifications',
      setMentionsOnlyRead: 'setMentionsOnlyRead'
    }),

    clickTracker(event) {
      const drawer = document.querySelector('.notification__drawer .el-drawer__open .el-drawer.rtl')

      const clickIn = event.path.includes(drawer)

      if (!clickIn) { this.setVisibility(false) }
    },

    applyFilters({ filter: { prescriptions, status }, tab }) {
      const filters = {
        prescriptions
      }

      if (status) {
        filters.status = status.split(',')
      }

      this.setTicketsActiveTab(tab.toLowerCase())

      this.setTicketsFilters({
        filters,
        hasFilters: true
      })

      this.getTickets()

      if (this.$route.name !== 'negotitation') {
        this.$router.push('/negotiation')
      }

      this.toggleShowNotifications()
    },

    openMention({ workspaceId, disputeId, id }) {
      this.loading = true

      this.setReaded(id).then(() => {
        this.setVisibility(false)
        this.$router.push(`/redirect?wid=${workspaceId}&did=${disputeId}`)
      }).finally(() => {
        this.loading = false
      })
    },

    setReaded(mentionId) {
      return this.setMentionReaded(mentionId)
    },

    setAllReaded() {
      Promise.all([
        ...this.notifications.content.filter(({ readDate }) => !readDate).map(({ id }) => this.setReaded(id))
      ]).then(() => {
        this.setVisibility(false)
      })
    },

    seeNextpage() {
      this.getMentions('nextPage')
    },

    notifyMention(mention) {
      this.$jusNotification({
        title: this.getMemberName(mention.fromAccountId),
        message: `Mencionou você #${mention.disputeId}`,
        type: 'primary',
        duration: 2500,
        position: 'top-right',
        iconClass: 'el-icon-message-solid',
        onClick: () => this.openMention(mention)
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.notification-popover .popper__arrow::after {
  border-bottom-color: $--color-primary !important;
}

.justtine-notification {
  .jus-avatar-user {
    width: 24px;
    height: 24px;

    img {
      width: 24px;
      height: 24px;
    }
  }
}

.justtine-mentions-collapse {
  .el-collapse-item {
    div[role="tab"] {
      .el-collapse-item__header {
        color: $--color-text-primary;
        font-weight: bold;
        border: none;
        border-radius: 4px;
        line-height: 24px;
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 0;
        padding: 4px 8px;

        .jus-avatar-user {
          width: 24px;
          height: 24px;
          font-size: 10px;

          img {
            width: 24px;
            height: 24px;
          }
        }

        span {
          line-height: 24px;
        }

        &:hover {
          background-color: $--color-light-gray;
        }
      }
    }

    div[role="tabpanel"] {
      border: none;
      margin-left: 16px;

      .el-collapse-item__content {
        .notification__drawer__list-item {
          .notification__drawer__list-item-name {
            div {
              .justtine-notification {
                span {
                  height: 24px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.notification__drawer {
  margin: -8px;
  padding: 8px 16px;
  border-radius: 4px;
  min-width: 350px;

  border-top: solid 8px $--color-primary;

  .notification__drawer__header {
    position: relative;
    color: $--color-primary;

    .notification__drawer__header-label {
      font-weight: bold;
      font-size: 19px;

      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;

      .notification__drawer__header-label-switch {
        font-size: 12px;
        font-weight: normal;
        color: $--color-text-secondary;
        display: flex;
        gap: 8px;
        align-items: center;

        i {
          cursor: pointer;
          font-size: 24px;

          &.active {
            color: #9461f7;
          }

          &.inactive {
            color: #979797;
          }
        }
      }
    }
  }

  .notification__drawer__list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .notification__drawer__list-top {
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      width: 100%;

      .notification__drawer__list-top-mark-as-readed {
        display: flex;
        justify-self: flex-end;
        font-size: 12px;
      }
    }

    .notification__drawer__list-notifications {
      width: 100%;
      overflow-y: scroll;
      max-height: 55vh;
      margin: 0;
      padding: 0;

      .notification__drawer__list-notifications-item {
        width: 100%;
        padding: 8px 0;
        cursor: pointer;

        .notification__drawer__list-item {
          padding: 8px 2%;
          border-radius: 4px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;
          gap: 4px;

          .notification__drawer__list-item-date {
            font-size: 12px;
            color: $--color-text-secondary;
          }
        }
      }
    }

    .notification__drawer__list-close {
      justify-self: flex-end;
    }
  }

  .notification__drawer__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 5%;

    .notification__drawer__footer-see-more {
      color: $--color-text-secondary;
      font-size: 12px;
      cursor: pointer;
      margin: 8px auto;
    }

    .notification__drawer__footer-button {
      span > .el-badge > span {
        margin-right: 8px;
      }
    }
  }
}

.notification__drawer__grayline {
  width: 100%;
  height: 1px;
  background-color: #F1F1F3;
}

.notification__drawer__list-item-pendent {
  .notification__drawer__list-item-name {
    color: $--color-black;

    div {
      font-weight: bold;
    }
  }
}
</style>
