<template>
  <div class="jus-notification-card">
    <i class="el-icon-error" />
    <div class="jus-notification-card__header">
      <jus-avatar-user size="sm" />
      <span class="jus-notification-card__title">{{ title }}</span>
      <span class="jus-notification-card__date">{{ date }}</span>
    </div>
    <div class="jus-notification-card__main">
      {{ main }}
    </div>
    <div class="jus-notification-card__complement">
      {{ complement }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusNotificationCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    main: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    complement: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
  .jus-notification-card {
    border: solid 1px #ffffff;
    padding: 20px;
    margin: 0 10px;
    position: relative;
    &:hover {
      background-color: #f7f7f7;
      border: solid 1px #9461f7;
      border-radius: 6px;
      .el-icon-error{
        display: block;
      }
    }
    .el-icon-error{
      display: none;
      position: absolute;
      right: -10px;
      top: -10px;
      background-color: #f7f7f7;
      color: #adadad;
      font-size: 18px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .jus-notification-card__header {
    display: flex;
    align-items: center;
  }
  .jus-notification-card__title {
    width: 100%;
    padding: 0 20px;
  }
  .jus-notification-card__main {
    margin: 10px 0 4px;
  }
  .jus-notification-card__complement {
    font-size: 12px;
    color: #adadad;
  }
  .jus-notification-card__date {
    white-space: nowrap;
    text-align: right;
    font-size: 12px;
    color: #adadad;
  }
</style>
