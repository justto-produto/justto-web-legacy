<template>
  <section
    class="interaction-container"
    :class="`${interaction.direction} ${type}`"
  >
    <!-- class="interaction-container__balloon" -->
    <div
      :class="`${interaction.direction} ${!flat ? 'interaction-container__balloon' : ''}`"
    >
      <div class="interaction-container__balloon-content">
        <component
          :is="type"
          :value="interaction"
          :occurrence="value"
        />
      </div>
    </div>
    <span
      v-if="showReply && !flat"
      :class="{ 'active-icon': isInRecipients }"
      class="interaction-container__reply"
    >
      <jus-icon
        class="interaction-container__reply-icon"
        icon="reply"
        :is-active="isInRecipients"
        @click="reply"
      />
      <jus-icon
        class="interaction-container__reply-icon-remove"
        icon="rejected-red"
        @click="reply"
      />
    </span>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
const negotiatorTypes = [
  'NEGOTIATOR_ACCESS',
  'NEGOTIATOR_PROPOSAL',
  'NEGOTIATOR_COUNTERPROSAL',
  'NEGOTIATOR_CHECKOUT',
  'NEGOTIATOR_ACCEPTED',
  'NEGOTIATOR_REJECTED'
]

export default {
  components: {
    COMMUNICATION: () => import('./partials/Communication'),
    ATTACHMENT: () => import('@/views/main/dispute/partials/partials/AttachmentOccurrence'),
    NEGOTIATOR: () => import('./partials/Negotiator'),
    MANUAL: () => import('./partials/Manual'),
    SCHEDULER: () => import('./partials/Scheduler'),
    NPS: () => import('./partials/Nps')
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients',
      flat: 'getExportTicketModalVisible',
      lastInteraction: 'disputeLastInteractions'
    }),

    type() {
      return this.value.interaction.type.split('_')[0]
    },

    isInRecipients() {
      return this.recipients.map(({ value }) => value).includes(this.replyAdress)
    },

    messageType() {
      const mapCommunicationTypes = {
        EMAIL: 'email',
        WHATSAPP: 'whatsapp',
        NEGOTIATOR_MESSAGE: 'negotiation',
        SMS: 'sms',
        NPS: 'nps'
      }
      if (this.interaction?.message?.communicationType) {
        const { communicationType } = this.interaction.message
        if (Object.keys(mapCommunicationTypes).includes(communicationType)) {
          return mapCommunicationTypes[communicationType]
        }
      } else if ((this.interaction?.type || '').includes('NEGOTIATOR')) {
        return 'negotiation'
      }
      return 'default'
    },

    interaction() {
      return this.value.interaction
    },

    personName() {
      if (this.type === 'MANUAL') {
        return this.interaction?.properties?.USER
      }

      if (this.interaction?.properties?.PERSON_NAME) {
        return this.interaction.properties.PERSON_NAME
      } else if (this.interaction?.message?.parameters?.SENDER_NAME) {
        return this.interaction.message.parameters.SENDER_NAME
      }
      return ''
    },

    isInboundInteraction() {
      return this.interaction.direction === 'INBOUND'
    },

    avatarProps() {
      return {
        name: this.personName,
        size: 'md',
        purple: this.isInboundInteraction && this.type !== 'MANUAL'
      }
    },

    showReply() {
      const { type, direction, message } = this.interaction
      return (
        direction === 'INBOUND' &&
        (
          (!['ATTACHMENT'].includes(type) && ['EMAIL', 'WHATSAPP', 'NEGOTIATOR_MESSAGE'].includes(message?.communicationType)) ||
          (negotiatorTypes.includes(type) || (this.disputeLastInteractions || []).length)
        )
      )
    },

    replyAdress() {
      if (this.interaction?.properties?.PERSON_EMAIL) {
        return this.interaction.properties.PERSON_EMAIL
      } else if (this.interaction?.message?.sender) {
        return this.interaction.message.sender
      } else if (this.interaction?.message?.parameters?.SENDER_EMAIL) {
        return this.interaction.message.parameters.SENDER_EMAIL
      } else if (this.interaction?.message?.parameters?.SENDER) {
        return this.interaction.message.parameters.SENDER
      }
      return null
    }
  },
  methods: {
    ...mapActions(['addRecipient']),

    reply(_event) {
      let inReplyTo = null
      if (this.value.interaction?.message?.messageId) {
        inReplyTo = this.value.interaction.message.messageId
      }
      const reply = {
        type: this.messageType,
        value: this.replyAdress,
        key: 'address',
        inReplyTo
      }
      this.addRecipient(reply)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.interaction-container {
  display: flex;
  gap: 6px;
  align-items: center;

  height: auto;
  margin: 10px 24px 0px 24px;

  &.INBOUND {
    flex-direction: row;
  }

  &.OUTBOUND {
    flex-direction: row-reverse;
  }

  &.MANUAL {
    .interaction-container__balloon {
      background-color: white !important;
    }
  }

  &.MANUAL {
    flex-direction: row-reverse;
  }

  .interaction-container__balloon {
    overflow-x: hidden;
    max-width: 80%;
    border-radius: 6px;
    overflow-y: hidden;
    border: none;
    box-shadow: 0px 3px 6px #00000029;
    margin-bottom: 6px;

    display: flex;
    flex-direction: row;

    .interaction-container__balloon-avatar {
      margin: 6px;
    }

    .interaction-container__balloon-content {
      width: 100%;
    }

    &.INBOUND {
      flex-direction: row;
      background: mix($--color-light-gray, $--color-white, 50%);

      &.NEGOTIATOR {
        background: mix($--color-light-gray, $--color-white, 50%);
      }
    }

    &.OUTBOUND {
      flex-direction: row-reverse;
    }

    &.MANUAL {
      flex-direction: row-reverse;
    }

    &.ballon-email {
      border-color: #DFF4FE;
    }

    &.ballon-sms {
      border-color: #ECECEC;
    }

    &.ballon-negotiator-message-2 {
      border-color: #FFC5A5;
    }

    &.ballon-whatsapp {
      border-color: #a3f4c3;
    }
  }

  .interaction-container__reply {
    display: flex;
    height: 20px;

    .interaction-container__reply-icon {
      width: 20px;
      cursor: pointer;
    }

    .interaction-container__reply-icon-remove {
      width: 20px;
      cursor: pointer;
      display: none;
    }
  }
  .active-icon:hover {
    .interaction-container__reply-icon {
      display: none;
    }

    .interaction-container__reply-icon-remove {
      display: block;
    }
  }
}
</style>
