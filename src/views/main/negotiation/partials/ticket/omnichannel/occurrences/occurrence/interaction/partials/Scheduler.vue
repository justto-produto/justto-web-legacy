<template>
  <section class="scheduler-container">
    <div
      v-if="toPrint"
      class="date-to-print"
    >
      {{ sendDate | moment('[Em] DD/MM [-] HH:mm') }}
    </div>

    <span
      v-if="!hiddenContactInfo"
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

    <!-- SAAS-5036 -->
    <p
      v-if="isCanceled"
      class="scheduler-container__alert"
    >
      <i class="el-icon-close" />

      Mensagem automática agendada foi <strong>CANCELADA</strong>.
    </p>

    <!-- isWaiting -->
    <p
      v-else-if="isWaiting"
      class="scheduler-container__alert"
    >
      <jus-icon icon="clock" />

      Mensagem agendada para {{ scheduledTime | moment('DD/MM[ às ]HH:mm') }} que ainda não foi entregue.
    </p>

    <div
      v-if="!toPrint && !hiddenSendStatus"
      class="scheduler-container__status"
    >
      <br>
      <span class="scheduler-container__status-about">
        {{ sendDate | moment('HH:mm') }}
        <span v-if="sendStatus !== 'default' && !directionIn">
          •
        </span>

        <el-tooltip
          :disabled="!sendStatusDate"
        >
          <span slot="content">
            {{ {'readed': 'Lida', 'recived': 'Recebida', 'sent': 'Enviada'}[sendStatus] }}
            {{ sendStatusDate | moment() }}
          </span>

          <JusIcon
            v-if="sendStatus !== 'default' && !directionIn"
            class="scheduler-container__status-about-icon"
            :icon="`status-${sendStatus}`"
          />
        </el-tooltip>

        <GroupedOccurrences
          :have="!hideGrouping && haveGroupedOccurrences"
          :occurrences="groupedOccurrences"
          :parent-id="occurrence.id"
        />
      </span>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'

export default {
  components: {
    GroupedOccurrences: () => import('./partials/groupedOccurrence')
  },

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
    },

    hiddenContactInfo: {
      type: Boolean,
      default: false
    },

    hiddenSendStatus: {
      type: Boolean,
      default: false
    },

    hideGrouping: {
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
    },

    isCanceled() {
      return this.occurrence?.interaction?.message?.status === 'CANCELED'
    },

    isWaiting() {
      return this.occurrence?.interaction?.message?.status === 'WAITING' && this.occurrence?.interaction?.type === 'SCHEDULER'
    },

    scheduledTime() {
      return this.occurrence?.interaction?.message?.scheduledTime?.dateTime
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
    color: $--color-secondary;
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

  .scheduler-container__alert {
    font-style: italic;

    i, img {
      width: 14px;
      margin-bottom: -1.2px;
    }
  }
}
</style>
