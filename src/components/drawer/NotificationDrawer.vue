<template>
  <el-drawer
    class="notification__drawer"
    :visible.sync="isVisible"
    :with-header="false"
    @close="toggleShowNotifications(true)"
  >
    <div class="notification__drawer__header">
      <div class="notification__drawer__header-orangeline" />
      <div class="notification__drawer__header-hello">
        Olá Thamiris ;)
      </div>
      <div class="notification__drawer__header-subtitle">
        Estas são suas tarefas de hoje:
      </div>
    </div>
    <div
      v-for="notification in notifications"
      :key="`${notification.quantity}-${notification.type}`"
      class="notification__drawer__list"
    >
      <div class="notification__drawer__list-grayline" />
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
      <div class="notification__drawer__footer-grayline" />
      <el-button
        class="notification__drawer__footer-button"
        type="danger"
        @click="toggleShowNotifications"
      >
        Fechar
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      notifications: 'notifications'
    })
  },

  methods: {
    ...mapActions({
      setTicketsFilters: 'setTicketsFilters',
      setTicketsActiveTab: 'setTicketsActiveTab',
      getTickets: 'getTickets'
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
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
.notification__drawer {
  .notification__drawer__header {
    position: relative;
    padding: 55px 45px 20px 45px;
    color: $--color-secondary;
    .notification__drawer__header-orangeline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background-color: $--color-secondary;
    }
    .notification__drawer__header-hello {
      font-weight: bold;
      font-size: 19px;
    }
    .notification__drawer__header-subtitle {
      font-size: 15px;
      font-weight: 500;
    }
  }
  .notification__drawer__list {
    .notification__drawer__list-grayline {
      width: 90%;
      height: 1px;
      background-color: #F1F1F3;
    }
    .notification__drawer__list-item:hover {
      background-color: $--color-light-gray;
    }
    .notification__drawer__list-item {
      padding: 14px 14px 14px 45px;
      display: flex;
      flex-direction: row;
      cursor: pointer;
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
    .notification__drawer__footer-grayline {
      width: 90%;
      height: 1px;
      background-color: #F1F1F3;
    }
    .notification__drawer__footer-button {
      margin: 20px 0px 20px 45px;
    }
  }
}

</style>
