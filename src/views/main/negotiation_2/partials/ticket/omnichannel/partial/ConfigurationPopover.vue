<template>
  <el-popover
    placement="bottom-end"
    trigger="click"
    popper-class="omnichannel-configuration__popover"
  >
    <Configurations />

    <el-button
      slot="reference"
      type="text"
    >
      <jus-icon icon="omnichannel-menu" />
    </el-button>
  </el-popover>
</template>

<script>
export default {
  components: {
    Configurations: () => import('./OmnichannelConfigurations')
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.omnichannel-container__configuration {
  .el-popover__reference-wrapper {
    .el-button {
      z-index: 11;
      padding: 0;
    }
  }
}
</style>
