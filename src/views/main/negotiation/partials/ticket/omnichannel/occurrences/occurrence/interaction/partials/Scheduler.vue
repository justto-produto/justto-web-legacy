<template>
  <section class="scheduler-container">
    <span
      v-if="to"
      class="scheduler-container__contact"
    >
      para
      <span
        class="scheduler-container__contact-address"
        @click="copyEmail">
        {{ to }}
      </span>
    </span>
    <div
      v-if="!hideContent"
      class="scheduler-container__message">
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
      <span v-else>
        <i class="el-icon-check" />
        Mensagem agendada foi entregue em
        {{ interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
      </span>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    hideContent: {
      type: Boolean,
      default: false
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

    to() {
      return this.interaction.message.receiver || false
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
  background-color: transparent;
  margin: 12px;

  .scheduler-container__message {
    font-size: 16px;
    color: #3C3B3B;

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
  }

  .scheduler-container__contact {
    color: #9A9797;

    .scheduler-container__contact-address {
      cursor: copy;
    }
  }
}
</style>