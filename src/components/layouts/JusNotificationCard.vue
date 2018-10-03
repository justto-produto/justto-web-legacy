<template lang="html">
  <div class="notification-card">
    <i class="el-icon-error"/>
    <div class="notification-card__header">
      <JusAvatarUser size="sm"/>
      <span class="notification-card__title">{{ title }}</span>
      <span class="notification-card__date">{{ date }}</span>
    </div>
    <div class="notification-card__main">
      {{ main }}
    </div>
    <div class="notification-card__complement">
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
  .notification-card {
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
  .notification-card__header {
    display: flex;
    align-items: center;
  }
  .notification-card__title {
    width: 100%;
    padding: 0 20px;
  }
  .notification-card__main {
    margin: 10px 0 4px;
  }
  .notification-card__complement {
    font-size: 12px;
    color: #adadad;
  }
  .notification-card__date {
    white-space: nowrap;
    text-align: right;
    font-size: 12px;
    color: #adadad;
  }
</style>
