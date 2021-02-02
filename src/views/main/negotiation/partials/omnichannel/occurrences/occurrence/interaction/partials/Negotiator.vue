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
      const { currency } = this.$options.filters
      const { PERSON_NAME, VALUE, NOTE, BANK_INFO } = this.interaction.properties
      switch (this.interaction.type) {
        case 'NEGOTIATOR_COUNTERPROSAL':
          return `Contraproposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${currency(VALUE)}</b>, com a nota: ${NOTE}`
        case 'NEGOTIATOR_PROSAL':
          return `Proposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${currency(VALUE)}</b>, com a nota: ${NOTE}`
        case 'NEGOTIATOR_ACCEPTED':
          return `Proposta no valor de <b>${currency(VALUE)}</b> foi aceita através do portal de negociações da JUSTTO por <b>${PERSON_NAME}</b>`
        case 'NEGOTIATOR_CHECKOUT':
          return `<b>Dados Bancários</b>:</br>${BANK_INFO}`.replaceAll(',', '</br>')
        default:
          return `<b>${this.interaction.type}</b>`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.negotiator-container {
  overflow-y: hidden;
  margin: 12px;
}
</style>
