<template>
  <el-drawer
    id="notification__drawer"
    class="notification__drawer"
    size="35%"
    :visible.sync="isVisible"
    @close="setVisibility(false)"
  >
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

          <el-switch
            v-model="onlyRead"
            active-color="#9461f7"
            inactive-color="#979797"
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

          <div
            v-for="(notification, notificationIndex) in notifications"
            :key="`${notificationIndex}-${notification.type}`"
            class="notification__drawer__list-item"
          >
            <span
              class="notification__drawer__list-item-name"
              @click="openMention(notification)"
            >
              <jus-avatar-user
                :name="getMemberName(notification.fromAccountId)"
                purple
                :size="width <= 1400 ? 'small' : 'sm'"
              />

              <strong v-if="!notification.readDate">
                {{ getMemberName(notification.fromAccountId) | resumedName }}
              </strong>

              <div v-else>
                {{ getMemberName(notification.fromAccountId) | resumedName }}
              </div>

              <span>
                mencionou você.
              </span>
            </span>

            <span class="notification__drawer__list-item-date">
              {{ parseDate(notification.createdAt) }}
            </span>

            <el-tooltip
              :open-delay="500"
              content="Marcar como lida"
              placement="bottom-start"
            >
              <div
                v-if="!notification.readDate"
                class="notification__drawer__list-item-status el-icon-pulse"
                @click="setReaded(notification.id)"
              />
            </el-tooltip>
          </div>
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
  </el-drawer>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { approximateTime } from '@/utils'

export default {
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
        const member = this.members.find(({ accountId }) => Number(accountId) === Number(fromAccountId))

        return member?.person?.name || member?.accountEmail || ''
      }
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
        this.getMentions()
      }
    },

    parseDate() {
      return (date) => approximateTime(date)
    }
  },

  watch: {
    isVisible(visible) {
      if (visible) {
        this.getMentions()

        setTimeout(() => {
          document.addEventListener('click', this.clickTracker)
        }, 250)
      } else {
        document.removeEventListener('click', this.clickTracker)
      }
    }
  },

  methods: {
    ...mapActions({
      setTicketsFilters: 'setTicketsFilters',
      setTicketsActiveTab: 'setTicketsActiveTab',
      getTickets: 'getTickets',
      setVisibility: 'setNotificationsVisible',
      setMentionReaded: 'setMentionReaded',
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
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.el-drawer__body {
  background-color: white;
  /* overflow-y: hidden !important; */
}

.el-drawer__container.el-drawer__open {
  height: auto;
  top: 10vh;
  bottom: 10vh;

  .el-drawer__header {
    background-color: white;
    border-bottom: solid #F1F1F3 2px;
    margin: 0;
  }

  .el-drawer {
    min-height: 80vh;
    background-color: white;

    border-top: solid $--color-primary 8px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.notification__drawer {
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
        display: flex;
        gap: 8px;
        font-size: 14px;
        font-weight: normal;
        color: $--color-text-secondary;
      }
    }
  }

  .notification__drawer__list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .notification__drawer__list-notifications {
      width: 100%;
      overflow-y: scroll;
      max-height: 60vh;
      margin: 0;
      padding: 0;

      .notification__drawer__list-notifications-item {
        width: 100%;
        padding: 14px 5%;
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

          .notification__drawer__list-item-name {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-wrap: nowrap;
          }

          .notification__drawer__list-item-date {
            font-size: 12px;
            color: $--color-text-secondary;
          }

          .notification__drawer__list-item-status {
            background-color: $--color-primary;
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          &:hover {
            background-color: $--color-light-gray;
          }

          .notification__drawer__list-item-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;

            .el-icon-success {
              color: $--color-success;
            }
          }

          .notification__drawer__list-item-label-gray {
            font-size: 14px;
            color: $--color-gray;
          }

          .notification__drawer__list-item-label-black {
            color: $--color-black;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }

    .notification__drawer__list-top {
      padding: 8px 5%;
      display: flex;
      justify-content: space-between;
      width: 100%;

      .notification__drawer__list-top-mark-as-readed {
        display: flex;
        justify-self: flex-end;
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
      margin: 16px auto;
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

</style>
