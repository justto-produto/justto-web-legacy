<template>
  <el-drawer
    class="notification__drawer"
    :visible.sync="isVisible"
    :with-header="false"
    @close="toggleShowNotifications(true)"
  >
    <div class="notification__drawer__header">
      <div class="notification__drawer__header-line" />
      <div class="notification__drawer__header-label">
        Notificações <sup />
      </div>
    </div>

    <div
      v-for="notification in notifications"
      :key="`${notification.quantity}-${notification.type}`"
      class="notification__drawer__list"
    >
      <div
        v-if="notification.quantity === 0"
        class="notification__drawer__list-item"
        @click="applyFilters(notification)"
      >
        <div
          class="notification__drawer__list-item-icon"
        >
          <i
            class="el-icon-success"
          />
        </div>
        <div class="notification__drawer__list-item-label-gray">
          {{ notification.name }}
        </div>
      </div>
      <div
        v-else
        class="notification__drawer__list-item"
        @click="applyFilters(notification)"
      >
        <div
          class="notification__drawer__list-item-icon"
        >
          <i
            class="el-icon-circle-check"
          />
        </div>
        <div class="notification__drawer__list-item-label-black">
          {{ notification.name }}
        </div>
      </div>
    </div>

    <div class="notification__drawer__footer">
      <div class="notification__drawer__grayline" />
      <el-button
        class="notification__drawer__footer-button"
        type="text"
        @click="toggleShowNotifications"
      >
        Ver lista de alertas
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      notifications: 'notifications',
      notificationVisible: 'areNotificationsVisible'
    }),

    isVisible: {
      get() {
        return this.notificationVisible
      },
      set(visible) {
        this.setVisibility(visible)
      }
    }
  },

  methods: {
    ...mapActions({
      setTicketsFilters: 'setTicketsFilters',
      setTicketsActiveTab: 'setTicketsActiveTab',
      getTickets: 'getTickets',
      setVisibility: 'setNotificationsVisible'
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
    }
  }
}
</script>

<style lang="scss">
.el-drawer__body {
  background-color: white;
}

.el-drawer__container.el-drawer__open {
  height: auto;
  top: 10vh;
  bottom: 10vh;

  .el-drawer {
    min-height: 80vh;
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.notification__drawer {
  .notification__drawer__header {
    position: relative;
    padding: 48px 24px 24px;
    color: $--color-primary;

    .notification__drawer__header-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background-color: $--color-primary;
    }

    .notification__drawer__header-label {
      font-weight: bold;
      font-size: 19px;

      border-bottom: solid #F1F1F3 2px;
    }

    .notification__drawer__header-subtitle {
      font-size: 15px;
      font-weight: 500;
    }
  }

  .notification__drawer__list {
    display: flex;
    flex-direction: column;
    align-items: center;

    .notification__drawer__list-item {
      width: 100%;
      padding: 14px 14px 14px 45px;
      display: flex;
      flex-direction: row;
      cursor: pointer;

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

    .notification__drawer__footer-button {
      margin: 20px 0px 20px 45px;
    }
  }
}

.notification__drawer__grayline {
  width: 50%;
  height: 1px;
  background-color: #F1F1F3;
}

</style>
