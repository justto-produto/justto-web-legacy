<template>
  <section class="negotiator-container">
    <div
      v-if="toPrint"
      class="date-to-print"
    >
      {{ sendDate | moment('[Em] DD/MM [-] HH:mm') }}
    </div>
    <div class="negotiator-container__contact">
      <JusIcon
        class="negotiator-container__email-icon"
        icon="negotiator-message-2"
      />
      <span
        v-if="contact.length"
        class="negotiator-container__email-prefix"
      >
        {{ prefix }}
      </span>

      {{ contact }}
    </div>
    <div
      class="negotiator-container__content"
      v-html="message"
    />
    <span
      v-if="!toPrint"
      class="negotiator-container__about negotiation-occurrence-about"
    >
      <span class="negotiator-container__about__time">
        {{ sendDate | moment('HH:mm') }}
      </span>

      <span v-if="status.icon">
        •
      </span>

      <el-tooltip
        :open-delay="600"
        :content="status.tooltip"
      >
        <jus-icon
          class="negotiator-container__about__icon"
          :icon="status.icon"
        />
      </el-tooltip>
    </span>
  </section>
</template>

<script>
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'

export default {
  mixins: [communicationSendStatus],

  props: {
    value: {
      type: Object,
      required: true
    },
    occurrence: {
      type: Object,
      required: true
    }
  },

  computed: {
    interaction() {
      return this.value
    },

    message() {
      const { PERSON_NAME, VALUE, NOTE, BANK_INFO } = this.interaction.properties
      let text = `<b>${this.interaction.type}</b>`
      switch (this.interaction.type) {
        case 'NEGOTIATOR_COUNTERPROSAL':
          text = `Contraproposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${VALUE}</b>`
          if (NOTE) {
            text += `, com a nota: ${NOTE}`
          } else {
            text += '.'
          }
          break
        case 'NEGOTIATOR_PROPOSAL':
          text = `Proposta realizada por <b>${PERSON_NAME}</b>, no valor de <b>${VALUE}</b>`
          if (NOTE) {
            text += `, com a nota: ${NOTE}`
          } else {
            text += '.'
          }
          break
        case 'NEGOTIATOR_ACCEPTED':
          text = `Proposta no valor de <b>${VALUE}</b> foi aceita através do portal de negociações da JUSTTO por <b>${PERSON_NAME}</b>`
          break
        case 'NEGOTIATOR_CHECKOUT':
          text = `<b>Dados Bancários</b>:</br>${BANK_INFO}`.replace(/,/g, '</br>')
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

    prefix() {
      return this.directionIn ? 'de' : 'para'
    },

    contact() {
      return this.interaction?.properties?.PERSON_EMAIL || ''
    },

    status() {
      const status = this.value?.properties?.DISPUTE_STATUS

      return {
        icon: status?.toLowerCase() || '',
        tooltip: status ? `No momento desta ocorrência, esta disputa estava ${this.$tc('dispute.status.' + status)}.` : ''
      }
    }
  },

  updated() {
    this.$set(this.occurrence, 'renderCompleted', true)
  },

  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.negotiator-container {
  overflow-y: hidden;
  margin: 12px;

  .negotiator-container__content {
    display: block;
    font-size: 16px;
    color: $--color-text-primary;

    @media (max-height: 900px) {
      font-size: 14px;
    }
  }

  .negotiator-container__contact {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    font-weight: 600;
    color: $--color-text-primary;

    .negotiator-container__email-icon {
      width: 16px;
      margin-bottom: -3px;
    }
  }

  .negotiator-container__about {
    color: #3C3B3B;

    .negotiator-container__about__time {
      word-break: keep-all;
    }

    .negotiator-container__about__icon {
      width: 14px;
    }
  }
}
</style>
