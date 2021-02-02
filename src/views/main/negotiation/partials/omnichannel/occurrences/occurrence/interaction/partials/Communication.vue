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
      <span
        v-if="!isValidName"
        class="communication-container__email-contact"
      >
        &lt;{{ contact }}&gt;
      </span>
    </div>

    <div class="communication-container__message">
      {{ text }}
    </div>

    <div class="communication-container__about">
      {{ sendDate[sendStatus] }}
      •
      <JusIcon
        v-if="sendStatus && !directionIn"
        class="communication-container__about-icon"
        :icon="`status-${sendStatus}`"
      />
      <el-tooltip>
        <div
          slot="content"
          style="max-width: 400px; text-align: justify;"
        >
          <span v-html="hasError" />
        </div>
        <JusIcon
          v-if="hasError"
          class="communication-container__about-icon"
          icon="alert"
        />
      </el-tooltip>
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
      const name = this.interaction.message.parameters[this.directionIn ? 'SENDER_NAME' : 'RECEIVER_NAME']
      return name
    },

    isValidName() {
      const regex = new RegExp('(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,24}))')
      return regex.test(this.person)
    },

    sendDate() {
      const first = (first) => (first ? first.split(' ')[0] : '')
      const defaultDate = this.interaction?.updateAt?.dateTime ? this.interaction.updateAt.dateTime : this.interaction.createAt.dateTime

      return {
        sent: first(this.interaction?.message?.parameters?.SEND_DATE),
        readed: first(this.interaction?.message?.parameters?.READ_DATE),
        recived: first(this.interaction?.message?.parameters?.RECEIVER_DATE),
        default: this.$moment(defaultDate).format('DD/MM/YY[ às ]HH:mm')
      }
    },

    sendStatus() {
      if (this.sendDate.readed) {
        return 'readed'
      } else if (this.sendDate.recived) {
        return 'recived'
      } else if (this.sendDate.sent) {
        return 'sent'
      } else {
        return 'default'
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

    text() {
      if (this.interaction?.message?.resume) {
        return this.interaction.message.resume
      } else if (this.interaction?.message?.parameters?.SUBJECT) {
        return this.interaction?.message?.parameters?.SUBJECT
      }

      return ''
    },

    hasError() {
      return this.interaction?.message?.parameters?.FAILED_SEND
    }
  }
}
</script>

<style lang="scss" scoped>
.communication-container {
  overflow: hidden;

  .communication-container__email {
    display: flex;
    align-items: center;
    gap: 6px;

    font: normal normal normal 15px/18px Proxima Nova;
    color: #9A9797;

    margin-bottom: 6px;
    width: max-content;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

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
    align-items: center;
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
