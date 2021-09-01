<template>
  <div class="notification">
    <el-popover
      placement="bottom"
      width="450"
      trigger="click"
      popper-class="notification-popover"
    >
      <NotificationDrawer />

      <div
        slot="reference"
        class="notification__icon"
      >
        <div
          v-if="qtdNotifications !== 0"
          class="notification__icon__counter el-icon-pulse"
          v-text="qtdNotifications"
        />

        <i class="el-icon-bell" />
      </div>
    </el-popover>
    <!-- <el-tooltip
      content="Notificações"
      :open-delay="200"
    >
      <div
        class="notification__icon"
        @click="toggle()"
      >
        <div
          v-if="qtdNotifications !== 0"
          class="notification__icon__counter el-icon-pulse"
        >
          {{ qtdNotifications }}
        </div>
        <i class="el-icon-bell" />
      </div>
    </el-tooltip> -->
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    NotificationDrawer: () => import('@/components/drawer/NotificationDrawer.vue')
  },

  computed: {
    ...mapGetters({
      qtdNotifications: 'qtdNotifications',
      workspaceId: 'workspaceId',
      loggedPersonId: 'loggedPersonId',
      hoursDiff: 'notificationHoursDiff'
    })
  },

  watch: {
    hoursDiff(current) {
      if (current >= 3) {
        this.toggleShowNotifications(true)
      }
    }
  },

  methods: {
    ...mapMutations({
      toggleShowNotifications: 'toggleShowNotifications'
    }),

    ...mapActions(['setNotificationsVisible']),

    toggle() {
      this.$jusSegment('Clique Notificações',
        {
          qtdNotifications: this.qtdNotifications
        })
      this.setNotificationsVisible(true)
      // this.toggleShowNotifications(true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.notification {
  text-align: center;
  margin-top: 8px;

  .notification__icon {
    text-align: center;
    height: 30px;
    width: 30px;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    font-size: 25px;
    color: rgb(95, 93, 93);
    position: relative;
    cursor: pointer;
    margin-bottom: 10px;

    .notification__icon__counter {
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      margin: -2px -2px 0 0;
      font-size: 14px;
      font-weight: bold;
      background-color: red;
      border-radius: 50px;
      padding: 2px 6px;
      color: white;
    }
  }
}

</style>
