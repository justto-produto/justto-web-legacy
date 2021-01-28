<template>
  <section class="communication-container">
    <div class="communication-container__email">
      <JusIcon icon="email" />
      {{ interaction.direction === 'INBOUND' ? 'de' : 'para' }}
    </div>
    <div class="communication-container__message">
      {{ interaction.message.resume }}
    </div>
    <div class="communication-container__about">
      sobre
    </div>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    interaction() {
      return this.value
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
