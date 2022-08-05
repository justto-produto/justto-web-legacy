<template>
  <div class="jus-sidenav-external">
    <a @click.prevent="$router.push('/login')">
      <img
        class="jus-sidenav-external__logo"
        src="@/assets/logo.svg"
      >
    </a>

    <div
      v-if="showPlans"
      class="jus-sidenav-external__title"
    >
      <div>
        <span>15</span>
        <span>dias de teste<br>gratuito</span>
      </div>
      <div>
        Máximo de <br>100 disputas
      </div>
    </div>

    <div class="jus-sidenav-external__content">
      <slot />
    </div>
    <div
      v-if="showExit"
      class="jus-sidenav-external__exit"
    >
      <a @click="$router.push('login')">Sair</a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'JusSidenavexternal',
  props: {
    showPlans: {
      type: Boolean,
      default: false
    },
    showExit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      modalType: 1
    }
  },
  methods: {
    showModal(type) {
      this.modalType = type
      this.modal = true
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-sidenav-external {
  height: 100%;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    padding: 0 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    div + div {
      margin-left: 15%;
      margin-right: 12px;
    }
    div {
      font-size: 20px;
      &:first-child {
        color: $--color-secondary;
        span {
          font-size: 30px;
          display: inline-block;
          vertical-align: middle;
          &:first-child {
            font-size: 100px;
            font-weight: 500;
          }
          & + span {
            margin-left: 20px;
          }
        }
      }
    }
  }
  &__divider {
    width: 100%;
    display: flex;
    font-size: 20px;
    white-space: nowrap;
    margin: 60px 0;
    div {
      margin-left: 20px;
      position: relative;
      width: 100%;
      &:after {
        content: ' ';
        position: absolute;
        top: 12px;
        left: 0;
        right: 0;
        border-top: 2px solid #eeeeee;
      }
    }
  }
  &__price {
    width: 100%;
    color: $--color-primary;
    span{
      font-size: 30px;
      font-weight: 500;
      &:first-child {
        font-size: 60px;
      }
      & + span {
        margin-left: 20px;
      }
    }
  }
  &__plans {
    width: 100%;
    margin-top: 40px;
    .el-button {
      border-radius: 6px;
      font-size: 16px;
      white-space: normal;
      background-color: transparent;
      padding: 20px;
      text-align: left;
      div {
        margin-bottom: 10px;
        font-size: 30px;
        font-weight: 500;
      }
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
  slot {
    margin: 40px;
  }
  &__content {
    width: calc(100% - 28px);
    align-self: flex-start;
    margin-left: 14px;
    margin-right: 14px;
    margin-bottom: auto;
    margin-top: 134px;
  }
  &__logo, &__exit{
    margin: 40px;
    position: absolute;
    left: 0;
  }
  &__logo{
    top: 0;
  }
  &__exit {
    bottom: 0;
  }
  .el-collapse {
    margin: 20px 0;
  }
  .el-dialog {
    &__header {
      padding-top: 40px;
    }
    .el-button {
      min-width: 128px;
    }
  }
}
</style>
