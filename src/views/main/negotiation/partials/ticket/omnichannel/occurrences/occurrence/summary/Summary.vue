<template>
  <section class="summary-container">
    SUMMARY
  </section>
</template>

<script>

export default {
  updated() {
    this.$set(this.value, 'renderCompleted', true)
  },
  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  }
}
</script>

<style lang="scss" scoped>

</style>
