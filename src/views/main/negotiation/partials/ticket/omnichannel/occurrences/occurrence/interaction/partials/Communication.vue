<template>
  <section class="communication-container">
    <div
      v-if="toPrint"
      class="date-to-print"
    >
      {{ sendDate | moment('[Em] DD/MM [-] HH:mm') }}
    </div>
    <div
      class="communication-container__email"
      :class="directionIn || toPrint ? 'INBOUND' : 'OUTBOUND'"
    >
      <JusIcon
        class="communication-container__email-icon"
        :icon="messageType"
      />
      <span
        v-if="contact"
        class="communication-container__email-prefix"
      >
        {{ prefix }}
      </span>
      <span
        v-if="!isSimilarName && person"
        class="communication-container__email-person"
      >
        {{ person }}
      </span>
      <span
        v-if="contact"
        class="communication-container__email-contact"
        @click="copyEmail"
      >
        <span v-if="!isSimilarName && person">&lt;</span>
        {{ contact }}
        <span v-if="!isSimilarName && person">&gt;</span>
      </span>
    </div>

    <div class="communication-container__message">
      <span
        v-if="!canShowFullMessage && !isSmallText && !toPrint"
        class="communication-container__message-link"
        @click="deleteFullMessage(interaction.message.messageId)"
      >
        Ver menos
      </span>
      <span v-html="message" />
      <span
        v-if="canShowFullMessage && !toPrint"
        class="communication-container__message-link"
        @click="getFullMessage(interaction.message.messageId)"
      >
        Ver mais
      </span>
    </div>

    <div
      v-if="!toPrint"
      class="communication-container__about"
    >
      {{ sendDate | moment('HH:mm') }}
      <span v-if="sendStatus !== 'default' && !directionIn">
        •
      </span>
      <!-- :content="sendStatusDate" -->
      <el-tooltip
        :disabled="!sendStatusDate"
      >
        <span slot="content">
          {{ {'readed': 'Lida', 'recived': 'Recebida', 'sent': 'Enviada'}[sendStatus] }}
          {{ sendStatusDate | moment('[ em ] DD/MM/YYYY [ às ] HH:mm') }}
        </span>

        <JusIcon
          v-if="sendStatus !== 'default' && !directionIn"
          class="communication-container__about-icon"
          :icon="`status-${sendStatus}`"
        />
      </el-tooltip>
      <GroupedOccurrences
        :have="haveGroupedOccurrences"
        :occurrences="groupedOccurrences"
      />
      <el-tooltip
        :open-delay="600"
      >
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
    occurrence: {
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

    prefix() {
      return this.directionIn ? 'de' : 'para'
    },

    contact() {
      return this.interaction.message[this.directionIn ? 'sender' : 'receiver']
    },

    messageType() {
      const mapCommunicationTypes = {
        SMS: 'sms',
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

  updated() {
    this.$set(this.occurrence, 'renderCompleted', true)
  },

  mounted() {
    this.$set(this.value, 'renderCompleted', true)
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
  background-color: transparent;
  overflow: hidden;
  margin: 6px;
  padding: 0px;

  .communication-container__email {
    display: flex;
    align-items: center;
    gap: 6px;

    color: #9A9797;
    font-weight: 600;

    margin-bottom: 6px;
    width: max-content;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    &.INBOUND {
      color: $--color-text-primary;
    }

    &.OUTBOUND {
      color: $--color-secondary;
    }

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
    max-width: 40vw;

    @media (max-height: 900px) {
      font-size: 14px;
    }

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

@media (max-height: 900px) {
  .communication-container {
    .communication-container__message {
      font-size: 14px;
    }
  }
}
</style>
