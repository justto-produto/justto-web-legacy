<template>
  <div class="notification">
    <el-tooltip
      content="Notificações"
      :open-delay="200"
    >
      <div
        class="notification__icon"
        @click="toggle()"
      >
        <div
          v-if="qtdNotifications !== 0"
          class="notification__icon__counter"
        >
          {{ qtdNotifications }}
        </div>
        <i class="el-icon-bell" />
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      qtdNotifications: 'qtdNotifications',
      workspaceId: 'workspaceId',
      loggedPersonId: 'loggedPersonId'
    })
  },

  methods: {
    ...mapMutations({
      toggleShowNotifications: 'toggleShowNotifications'
    }),

    toggle() {
      this.$jusSegment('Clique Notificações',
        {
          qtdNotifications: this.qtdNotifications
        })
      this.toggleShowNotifications(true)
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
    font-size: 22px;
    color: rgb(95, 93, 93);
    position: relative;
    cursor: pointer;
    .notification__icon__counter {
      text-align: center;
      position: absolute;
      right: 0;
      top: 0;
      margin: -2px -2px 0 0;
      font-size: 8px;
      font-weight: bold;
      background-color: red;
      border-radius: 50px;
      padding: 1px 4px;
      color: white;
    }
  }
}

</style>
