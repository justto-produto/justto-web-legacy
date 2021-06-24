<template>
  <div class="notification">
    <div
      class="notification__icon"
      @click="toggleShowNotifications(false)"
    >
      <div class="notification__icon__counter">
        {{ qtdNotifications }}
      </div>
      <i class="el-icon-bell" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      qtdNotifications: 'qtdNotifications'
    })
  },

  methods: {
    ...mapMutations({
      toggleShowNotifications: 'toggleShowNotifications'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.notification {
  text-align: center;

  .notification__icon {
    text-align: center;
    height: 30px;
    width: 30px;
    background-color: #979797;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    font-size: 22px;
    color: white;
    position: relative;
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
    }
  }
}

</style>
