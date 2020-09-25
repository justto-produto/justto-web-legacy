<template lang="html">
  <div class="jus-loader">
    <div
      v-loading="true"
      :element-loading-text="content"
      :class="color"
      class="jus-loader__spinner"
      element-loading-background="rgba(0, 0, 0, 0)"
    />
  </div>
</template>

<script>
export default {
  name: 'JusLoader',
  props: {
    content: {
      default: '',
      type: String
    },
    color: {
      default: 'main',
      type: String
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-loader {
  .jus-loader__spinner {
    height: 20px;

    .el-loading-spinner {
      .circular{
        width: 20px;
      }
    }
  }

  .warning {
    .el-loading-spinner {
      .circular .path {
        stroke: $--color-warning !important;
      }
    }
  }
}
</style>
