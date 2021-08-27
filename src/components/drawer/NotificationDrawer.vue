<template>
  <el-drawer
    class="notification__drawer"
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
      </div>
    </div>

    <div
      v-loading="loading"
      class="notification__drawer__list"
    >
      <div
        v-for="(notification, notificationIndex) in notifications.content"
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

          <strong>
            {{ getMemberName(notification.fromAccountId) | resumedName }}
          </strong>

          <span>
            mencionou você.
          </span>
        </span>

        <span class="notification__drawer__list-item-date">
          {{ new Date(notification.createdAt) | moment('DD:MM [às] HH:mm') }}
        </span>

        <el-tooltip
          :open-delay="500"
          content="Marcar como lida"
          placement="bottom-start"
        >
          <div
            class="notification__drawer__list-item-status el-icon-pulse"
            @click="setReaded(notification.id)"
          />
        </el-tooltip>
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

export default {
  data: () => ({
    loading: false
  }),

  computed: {
    ...mapGetters({
      notifications: 'mentionNotifications',
      notificationVisible: 'areNotificationsVisible',
      qtdThamirisAlerts: 'qtdThamirisPendingAlerts',
      qtdMentions: 'qtdMentionsPending',
      members: 'workspaceMembers',
      width: 'getWindowWidth'
    }),

    getMemberName() {
      return (fromAccountId) => {
        const member = this.members.find(({ accountId }) => Number(accountId) === Number(fromAccountId))

        return member.person?.name || member.accountEmail
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
    }
  },

  methods: {
    ...mapActions({
      setTicketsFilters: 'setTicketsFilters',
      setTicketsActiveTab: 'setTicketsActiveTab',
      getTickets: 'getTickets',
      setVisibility: 'setNotificationsVisible',
      setMentionReaded: 'setMentionReaded'
    }),

    ...mapMutations({
      toggleShowNotifications: 'toggleShowNotifications'
    }),

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

    seeNextpage() {}
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.el-drawer__body {
  background-color: white;
}

.el-drawer__container.el-drawer__open {
  height: auto;
  top: 10vh;
  bottom: 10vh;

  .el-drawer__header {
    background-color: white;
    border-bottom: solid #F1F1F3 2px;
    margin: 0 5%;
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
    }
  }

  .notification__drawer__list {
    display: flex;
    flex-direction: column;
    align-items: center;

    .notification__drawer__list-item {
      width: 100%;
      padding: 14px 5%;
      cursor: pointer;

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
