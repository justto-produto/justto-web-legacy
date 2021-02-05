<template>
  <section class="scheduler-container">
    <div class="scheduler-container__message">
      <span
        v-if="!canShowFullMessage && !isSmallText"
        class="scheduler-container__message-link"
        @click="deleteFullMessage(interaction.message.messageId)">
        Ver menos
      </span>
      <span v-html="message" />
      <span
        v-if="canShowFullMessage"
        class="scheduler-container__message-link"
        @click="getFullMessage(interaction.message.messageId)">
        Ver mais
      </span>
    </div>
    <div class="scheduler-container__status">
      <br>
      <i
        :class="{ 'el-icon-close': status === 'CANCELED', 'clock': status === 'WAITING'}"
        style="width: 14px;margin-bottom: -1.2px;"
      />
      <span v-if="status === 'CANCELED'">
        Mensagem automática agendada foi <strong>CANCELADA</strong>.
      </span>
      <span v-else-if="status === 'WAITING'">
        Mensagem agendada para
        {{ interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
        que ainda não foi entregue.
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
    ])
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

    .scheduler-container__message-link {
      cursor: pointer;
      font-size: 12px;
      text-decoration: underline;
      color: $--color-primary;
    }
  }

  .scheduler-container__status {
    font-style: italic;
  }
}
</style>
