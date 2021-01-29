<template>
  <section class="negotiator-container">
    <span v-html="message" />
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
    },
    message() {
      const { PERSON_NAME, VALUE, NOTE } = this.interaction.properties
      switch (this.interaction.type) {
        case 'NEGOTIATOR_COUNTERPROSAL':
          return `Contraproposta realizada por <strong>${PERSON_NAME}</strong>, no valor de <strong>${VALUE}</strong>, com a nota: ${NOTE}`
        case 'NEGOTIATOR_PROSAL':
          return `Proposta realizada por <strong>${PERSON_NAME}</strong>, no valor de <strong>${VALUE}</strong>, com a nota: ${NOTE}`
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
