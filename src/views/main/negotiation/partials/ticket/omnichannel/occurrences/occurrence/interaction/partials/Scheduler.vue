<template>
  <section class="scheduler-container">
    <span
      class="scheduler-container__contact"
    >
      <JusIcon
        class="scheduler-container__contact-icon"
        :icon="messageType"
      />
      <span v-if="to">
        para
      </span>
      <span
        v-if="!isSimilarName && person"
        class="communication-container__email-person"
      >
        {{ person }}
      </span>
      <span
        v-if="to"
        class="scheduler-container__contact-address"
        @click="copyEmail"
      >
        <span>
          &lt;
        </span>
        {{ to }}
        <span>
          &gt;
        </span>
      </span>
    </span>
    <div
      v-if="!hideContent"
      class="scheduler-container__message"
    >
      <span
        v-if="!canShowFullMessage && !isSmallText"
        class="scheduler-container__message-link"
        @click="deleteFullMessage(interaction.message.messageId)"
      >
        Ver menos
      </span>
      <span v-html="message" />
      <span
        v-if="canShowFullMessage"
        class="scheduler-container__message-link"
        @click="getFullMessage(interaction.message.messageId)"
      >
        Ver mais
      </span>
    </div>
    <div class="scheduler-container__status">
      <br>
      <span v-if="status === 'CANCELED'">
        <i class="el-icon-close" />
        Mensagem automática agendada foi <strong>CANCELADA</strong>.
      </span>
      <span v-else-if="status === 'WAITING'">
        <jus-icon
          icon="clock"
          style="width: 12px;"
        />
        Mensagem agendada para
        {{ interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
        que ainda não foi entregue.
      </span>
      <span
        v-else
        class="scheduler-container__status-about"
      >
        {{ sendDate | moment('HH:mm') }}
        <span v-if="sendStatus !== 'default' && !directionIn">
          •
        </span>
        <JusIcon
          v-if="sendStatus !== 'default' && !directionIn"
          class="scheduler-container__status-about-icon"
          :icon="`status-${sendStatus}`"
        />
      </span>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'

export default {
  mixins: [communicationSendStatus],
  props: {
    value: {
      type: Object,
      required: true
    },
    hideContent: {
      type: Boolean,
      default: false
    },
    occurrence: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      fullMessages: 'getFullMessages'
    }),

    to() {
      return this.interaction.message.receiver || false
    },

    messageType() {
      const mapCommunicationTypes = {
        EMAIL: 'email',
        WHATSAPP: 'whatsapp',
        NEGOTIATOR_MESSAGE: 'negotiator-message-2'
      }
      if (this.value?.message?.communicationType) {
        const { communicationType } = this.value.message
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

    status() {
      return this.interaction?.message?.status
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

  updated() {
    this.$set(this.occurrence, 'renderCompleted', true)
  },

  mounted() {
    this.$set(this.occurrence, 'renderCompleted', true)
  },

  methods: {
    ...mapActions([
      'deleteFullMessage',
      'getFullMessage'
    ]),

    copyEmail(_event) {
      if (this.to) {
        navigator.clipboard.writeText(this.to)
        this.$message({
          message: 'E-mail copiado para a área de transferência.',
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

.scheduler-container {
  margin: 12px;

  .scheduler-container__message {
    font-size: 16px;
    color: #3C3B3B;

    @media (max-height: 900px) {
      font-size: 14px;
    }

    .scheduler-container__message-link {
      cursor: pointer;
      font-size: 12px;
      text-decoration: underline;
      color: $--color-primary;
      display: inline-block;
      margin-left: 6px;
    }
  }

  .scheduler-container__status {
    font-style: italic;

    .scheduler-container__status-about {
      font-style: normal;
      margin-top: -24px;

      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 6px;

      font-size: 12px;
      color: #9A9797;

      .scheduler-container__status-about-icon {
        width: 18px;
      }
    }
  }

  .scheduler-container__contact {
    color: #FF9300;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    gap: 6px;

    .scheduler-container__contact-icon {
      width: 16px;
    }

    .scheduler-container__contact-address {
      cursor: copy;
      display: flex;
    }
  }
}
</style>
