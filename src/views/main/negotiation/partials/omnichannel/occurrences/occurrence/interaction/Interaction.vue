<template>
  <section
    class="interaction-container"
    :class="`${interaction.direction} ${type}`"
  >
    <div class="interaction-container__out-avatar show-only-md">
      <JusAvatarUser v-bind="avatarProps" />
    </div>
    <div
      class="interaction-container__balloon"
      :class="`${interaction.direction} ballon-${messageType}`"
    >
      <div class="interaction-container__balloon-avatar show-only-sm">
        <JusAvatarUser v-bind="avatarProps" />
      </div>
      <div class="interaction-container__balloon-content">
        <component
          :is="type"
          :value="interaction"
        />
      </div>
    </div>
    <jus-icon
      v-if="showReply"
      class="interaction-container__reply-icon"
      icon="reply"
      @click="reply"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
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
    SCHEDULER: () => import('./partials/Scheduler')
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      lastInteraction: 'disputeLastInteractions'
    }),

    type() {
      return this.value.interaction.type.split('_')[0]
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
          (negotiatorTypes.includes(type) || this.disputeLastInteractions.length)
        )
      )
    }
  },
  methods: {
    reply(_event) {
      window.alert('RESPONDER')
    }
  }
}
</script>

<style lang="scss" scoped>
.interaction-container {
  display: flex;
  gap: 6px;

  height: auto;
  margin: 10px 24px 0px 24px;

  &.INBOUND {
    flex-direction: row;
  }

  &.OUTBOUND {
    flex-direction: row-reverse;
  }

  &.COMMUNICATION {
    .interaction-container__balloon {
      border: 5px solid #DFF4FE;
    }
  }

  &.SCHEDULER {
    .interaction-container__balloon {
      border: 5px dotted #DFF4FE;
    }
  }

  &.NEGOTIATOR, &.MANUAL {
    .interaction-container__balloon {
      border: 5px solid #FFC5A5;
    }
  }

  &.MANUAL {
    flex-direction: row-reverse;
  }

  .interaction-container__balloon {
    overflow-x: hidden;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #47454526;
    max-width: 80%;
    border-radius: 18px;
    overflow-y: hidden;

    display: flex;
    flex-direction: row;
    gap: 16px;

    .interaction-container__balloon-avatar {
      margin: 6px;
    }

    .interaction-container__balloon-content {
      width: 100%;
    }

    &.INBOUND {
      flex-direction: row;
    }

    &.OUTBOUND {
      flex-direction: row-reverse;
    }

    &.ballon-email {
      border-color: #DFF4FE;
    }

    &.ballon-negotiatior {
      border-color: #FFC5A5;
    }

    &.ballon-whatsapp {
      border-color: #a3f4c3;
    }
  }

  .interaction-container__reply-icon {
    width: 20px;
    cursor: pointer;
  }

}
</style>
