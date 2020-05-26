<template lang="html">
  <div class="jus-loader">
    <div
      v-loading="true"
      :element-loading-text="content"
      element-loading-background="rgba(0, 0, 0, 0)"
      class="jus-loader__spinner" />
  </div>
</template>

<script>
export default {
  name: 'JusLoader',
  props: {
    content: {
      default: '',
      type: String,
    },
  },
}
</script>

<style lang="scss">
.jus-loader {
  &__spinner {
    height: 30px;
    width: 140px;
  }
}
</style>
