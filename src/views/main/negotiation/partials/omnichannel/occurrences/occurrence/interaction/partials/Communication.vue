<template>
  <section class="communication-container">
    <div class="communication-container__email">
      <JusIcon
        class="communication-container__email-icon"
        :icon="messageType"
      />
      <span
        v-if="contact"
        class="communication-container__email-prefix">
        {{ prefix }}
      </span>
      <span
        v-if="!isValidName && person"
        class="communication-container__email-person">
        {{ person }}
      </span>
      <span
        v-if="contact"
        class="communication-container__email-contact"
        @click="copyEmail">
        <span v-if="!isValidName">&lt;</span>
        {{ contact }}
        <span v-if="!isValidName">&gt;</span>
      </span>
    </div>

    <div class="communication-container__message">
      <span
        v-if="!canShowFullMessage && !isSmallText"
        class="communication-container__message-link"
        @click="deleteFullMessage(interaction.message.messageId)">
        Ver menos
      </span>
      <span v-html="message" />
      <span
        v-if="canShowFullMessage"
        class="communication-container__message-link"
        @click="getFullMessage(interaction.message.messageId)">
        Ver mais
      </span>
    </div>

    <div class="communication-container__about">
      {{ sendDate[sendStatus] }}
      <span v-if="sendStatus !== 'default' && !directionIn">
        •
      </span>
      <JusIcon
        v-if="sendStatus !== 'default' && !directionIn"
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
import { isSimilarStrings } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      fullMessages: 'getFullMessages'
    }),

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
      return this.$options.filters.resumedName(name || '')
      // return name
    },

    isValidName() {
      return isSimilarStrings(this.person, this.contact, 75)
    },

    sendDate() {
      const first = (first) => (first ? first.split(' ')[1] : '')
      const defaultDate = this.interaction?.updateAt?.dateTime ? this.interaction.updateAt.dateTime : this.interaction.createAt.dateTime

      return {
        sent: first(this.interaction?.message?.parameters?.SEND_DATE),
        readed: first(this.interaction?.message?.parameters?.READ_DATE),
        recived: first(this.interaction?.message?.parameters?.RECEIVER_DATE),
        default: this.$moment(defaultDate).format('HH:mm')
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

    message() {
      const { messageId } = this.interaction.message
      return this.fullMessages[messageId] || this.text
    },

    isSmallText() {
      return this.text.length < 100
    },

    canShowFullMessage() {
      const { messageId } = this.interaction.message

      return !this.isSmallText && !Object.keys(this.fullMessages).includes(String(messageId))
    },

    hasError() {
      return this.interaction?.message?.parameters?.FAILED_SEND
    }
  },
  methods: {
    ...mapActions([
      'deleteFullMessage',
      'getFullMessage'
    ]),
    copyEmail(_event) {
      if (this.contact) {
        navigator.clipboard.writeText(this.contact)
        this.$message({
          message: 'Copiado para a área de transferência.',
          type: 'info',
          center: true,
          showClose: true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.communication-container {
  overflow: hidden;
  margin: 12px 12px 6px;
  padding: 0px;

  .communication-container__email {
    display: flex;
    align-items: center;
    gap: 6px;

    color: #9A9797;

    margin-bottom: 6px;
    width: max-content;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    .communication-container__email-contact {
      display: inherit;
      cursor: copy;
    }

    .communication-container__email-icon {
      width: 16px;
    }
  }

  .communication-container__message {
    font-size: 16px;
    color: #3C3B3B;

    /* margin-left: 6px; */

    .communication-container__message-link {
      cursor: pointer;
      font-size: 12px;
      text-decoration: underline;
      color: $--color-primary;
    }
  }

  .communication-container__about {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;

    font-size: 12px;
    color: #9A9797;

    .communication-container__about-icon {
      width: 18px;
    }
  }
}

@media (max-height: 680px) {
  .communication-container {
    .communication-container__message {
      font-size: 14px;
    }
  }
}
</style>
