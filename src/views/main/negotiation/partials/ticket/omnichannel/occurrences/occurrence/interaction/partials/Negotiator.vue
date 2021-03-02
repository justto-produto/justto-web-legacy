<template>
  <section class="negotiator-container">
    <div class="negotiator-container__contact">
      <JusIcon
        class="communication-container__email-icon"
        :icon="messageType"
      />
      <span
        v-if="contact.length"
        class="communication-container__email-prefix"
      >
        {{ prefix }}
      </span>

      {{ contact }}
    </div>
    <div
      class="negotiator-container__content"
      v-html="message"
    />
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
      let text = `<b>${this.interaction.type}</b>`
      switch (this.interaction.type) {
        case 'NEGOTIATOR_COUNTERPROSAL':
          text = `Contraproposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${currency(VALUE)}</b>`
          if (NOTE) {
            text += `, com a nota: ${NOTE}`
          } else {
            text += '.'
          }
          break
        case 'NEGOTIATOR_PROPOSAL':
          text = `Proposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${currency(VALUE)}</b>`
          if (NOTE) {
            text += `, com a nota: ${NOTE}`
          } else {
            text += '.'
          }
          break
        case 'NEGOTIATOR_ACCEPTED':
          text = `Proposta no valor de <b>${currency(VALUE)}</b> foi aceita através do portal de negociações da JUSTTO por <b>${PERSON_NAME}</b>`
          break
        case 'NEGOTIATOR_CHECKOUT':
          text = (`<b>Dados Bancários</b>:</br>${BANK_INFO}` || '').replaceAll(',', '</br>')
          break
      }

      return text
    },

    messageType() {
      const mapCommunicationTypes = {
        EMAIL: 'email',
        WHATSAPP: 'whatsapp',
        NEGOTIATOR_MESSAGE: 'negotiator-message-2'
      }
      if (this.interaction?.message?.communicationType) {
        const { communicationType } = this.interaction.message
        if (Object.keys(mapCommunicationTypes).includes(communicationType)) {
          return mapCommunicationTypes[communicationType]
        }
      }
      return 'email'
    },

    directionIn() {
      return this.interaction.direction === 'INBOUND'
    },

    prefix() {
      return this.directionIn ? 'de' : 'para'
    },

    contact() {
      return this.interaction?.properties?.PERSON_EMAIL || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.negotiator-container {
  background-color: transparent;
  overflow-y: hidden;
  margin: 12px;
}
</style>
