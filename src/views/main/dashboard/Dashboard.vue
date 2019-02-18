<template>
  <JusViewMain class="dashboard-view">
    <template slot="title">
      <h1>
        Dashboard
      </h1>
    </template>
    <template slot="main">
      <div
        class="typeform-widget"
        data-url="https://justto.typeform.com/to/Jo955E"
        data-transparency="0"
        data-hide-headers="true"
        data-hide-footer="true"
        style="width: 100%; height: 100%;" />
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss">
.dashboard-view {
  .el-card__body {
    height: 100%
  }
}
</style>
