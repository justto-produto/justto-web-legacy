<template>
  <section class="communication-container">
    <div class="communication-container__email">
      <JusIcon
        class="communication-container__email-icon"
        :icon="messageType"
      />
      <span class="communication-container__email-prefix">
        {{ prefix }}
      </span>
      <span class="communication-container__email-person">
        {{ person }}
      </span>
      <span class="communication-container__email-contact">
        &lt;{{ contact }}&gt;
      </span>
    </div>
    <div class="communication-container__message">
      {{ interaction.message.resume }}
    </div>
    <div class="communication-container__about">
      {{ sendDate[sendStatus] }}
      <JusIcon
        class="communication-container__about-icon"
        :icon="`status-${sendStatus}`"
      />
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
    },
    directionIn() {
      return this.interaction.direction === 'INBOUND'
    },
    prefix() {
      return this.directionIn ? 'de' : 'para'
    },
    contact() {
      return this.interaction.message[this.directionIn ? 'sender' : 'receiver']
    },
    person() {
      return this.interaction.message.parameters[this.directionIn ? 'SENDER_NAME' : 'RECEIVER_NAME']
    },
    sendDate() {
      const first = (first) => (first ? first.split(' ')[0] : '')

      const sent = first(this.interaction?.message?.parameters?.SEND_DATE)
      const readed = first(this.interaction?.message?.parameters?.READ_DATE)
      const recived = first(this.interaction?.message?.parameters?.RECEIVER_DATE)

      return { sent, readed, recived }
    },
    sendStatus() {
      if (this.sendDate.readed) {
        return 'readed'
      } else if (this.sendDate.recived) {
        return 'recived'
      } else if (this.sendDate.sent) {
        return 'sent'
      } else {
        return 'clock'
      }
    },
    messageType() {
      const mapCommunicationTypes = {
        EMAIL: 'email',
        WHATSAPP: 'whatsapp',
        NEGOTIATOR_MESSAGE: 'negotiatior'
      }
      if (this.interaction?.message?.communicationType) {
        const { communicationType } = this.interaction.message
        if (Object.keys(mapCommunicationTypes).includes(communicationType)) {
          return mapCommunicationTypes[communicationType]
        }
      }
      return 'email'
    },
  }
}
</script>

<style lang="scss" scoped>

.communication-container {
  .communication-container__email {
    display: flex;
    align-items: center;
    gap: 6px;

    font: normal normal normal 15px/18px Proxima Nova;
    color: #9A9797;

    margin-bottom: 6px;

    .communication-container__email-icon {
      width: 16px;
    }
  }

  .communication-container__message {
    font: normal normal normal 18px/22px Proxima Nova;
    color: #3C3B3B;
  }

  .communication-container__about {
    display: flex;
    justify-content: flex-end;
    gap: 6px;

    font: normal normal normal 15px/18px Proxima Nova;
    color: #9A9797;

    .communication-container__about-icon {
      width: 18px;
    }
  }
}

@media (max-height: 680px) {
  .communication-container {
    .communication-container__email {
      font: normal normal normal 12px/12px Proxima Nova;
    }
    .communication-container__message {
      font: normal normal normal 16px/18px Proxima Nova;
    }
    .communication-container__about {
      font: normal normal normal 12px/12px Proxima Nova;
    }
  }
}
</style>
