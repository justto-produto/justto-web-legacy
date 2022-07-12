<template>
  <section
    class="interaction-container"
    :class="`${interaction.direction} ${type}`"
  >
    <el-tooltip
      placement="top-end"
      :open-delay="500"
    >
      <div
        slot="content"
        style="text-align: center;"
        v-html="avatarProps.name"
      />

      <JusAvatarUser
        v-if="showAvatar"
        v-bind="avatarProps"
      />
    </el-tooltip>

    <div :class="`${interaction.direction} ${coloringType}-${messageType} ${!flat ? 'interaction-container__balloon' : ''} ${(scheduled || type === 'SCHEDULER') ? 'SCHEDULED' : ''}`">
      <div class="interaction-container__balloon-content">
        <component
          :is="type"
          :value="interaction"
          :occurrence="value"
          :hide-grouping="hideGrouping"
          :hide-info="isGrouping"
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

    <div class="display-break" />

    <InteractionStatus
      :value="interaction"
      :occurrence="value"
      :hide-grouping="hideGrouping"
    />

    <div
      v-if="showGrouped && groupedOccurrences.length"
      class="break-point"
    />

    <div
      v-if="showGrouped && groupedOccurrences.length"
      class="interaction-container__grouped"
    >
      <Interaction
        v-for="occurrence in groupedOccurrences"
        :key="occurrence.id"
        :value="occurrence"
        :show-grouped="false"
        :hide-grouping="true"
      />
    </div>

    <!-- Dialog de warning para LGPD -->
    <WarningLGPD
      :lgpd-dialog-visible="LGPDWarningDialogVisible"
      :is-phone-number="messageType === 'whatsapp' || messageType === 'sms'"
      :party-name="personName"
      @click="(ok) => handleLgpdWarning(ok)"
    />
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
  name: 'Interaction',

  components: {
    COMMUNICATION: () => import('./partials/Communication'),
    ATTACHMENT: () => import('@/views/main/dispute/partials/partials/AttachmentOccurrence'),
    NEGOTIATOR: () => import('./partials/Negotiator'),
    SCHEDULER: () => import('./partials/Scheduler'),
    PHONE: () => import('./partials/Phone.vue'),
    MANUAL: () => import('./partials/Manual'),
    NPS: () => import('./partials/Nps'),
    WHATSAPP: () => import('./partials/Whatsapp.vue'),
    WarningLGPD: () => import('@/components/dialogs/WarningLGPD'),
    InteractionStatus: () => import('./partials/InteractionStatus')
  },

  props: {
    value: {
      type: Object,
      required: true
    },

    showGrouped: {
      type: Boolean,
      default: true
    },

    hideGrouping: {
      type: Boolean,
      default: false
    },

    scheduled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      modalLoading: false,
      LGPDWarningDialogVisible: false
    }
  },

  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients',
      flat: 'getExportTicketModalVisible',
      lastInteraction: 'disputeLastInteractions',
      with: 'getWindowWidth',
      isJusttoAdmin: 'isJusttoAdmin',
      isAdminProfile: 'isAdminProfile',
      negotiators: 'getTicketOverviewNegotiators',
      getGroupedOccurrencesById: 'getGroupedOccurrencesById',
      properties: 'userProperties',
      isGrouping: 'isOmnichannelGrouping'
    }),

    type() {
      if (this.interaction?.direction === 'INBOUND' && this.interaction?.message?.communicationType === 'WHATSAPP' && ['FILE', 'VIDEO', 'IMAGE', 'AUDIO'].includes(this.interaction?.message?.contentType)) {
        return 'WHATSAPP'
      }

      if (this.interaction?.direction === 'OUTBOUND' && ['WAITING', 'PROCESSED', 'CANCELED', 'FAILED'].includes(this.interaction?.message?.status) && this.interaction?.message?.createdBy === 'system') {
        return 'SCHEDULER'
      }

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

      if (this.interaction?.message?.parameters?.SENDER_NAME) {
        return this.interaction?.message?.parameters?.SENDER_NAME
      } else if (this.interaction?.message?.parameters?.SENDER_EMAIL) {
        return this.interaction?.message?.parameters?.SENDER_EMAIL
      } else if (this.interaction?.properties?.PERSON_NAME) {
        return this.interaction.properties.PERSON_NAME
      }

      return ''
    },

    isInboundInteraction() {
      return this.interaction.direction === 'INBOUND'
    },

    showAvatar() {
      // TODO: Critérios de aceite: https://justto.atlassian.net/browse/SAAS-4454

      return this.isJusttineMessage || (
        !this.isInboundInteraction &&
        (this.isJusttoAdmin || this.isAdminProfile || this.negotiators.length > 1)
      )
    },

    avatarProps() {
      if (this.isJusttineMessage) {
        const justtineMessage = `
        Sou JUSTTINE, sua assistente virtual<br>
        Enviei esta mensagem para você, ok?<br>
        Criei ela a partir da estratégia que você definiu na disputa.`

        return {
          name: justtineMessage,
          src: require('@/assets/justtine/profile.png'),
          size: 'sm'
        }
      } else {
        return {
          name: this.personName || this.interaction.createdBy,
          size: 'sm',
          purple: this.isInboundInteraction && this.type !== 'MANUAL'
        }
      }
    },

    isJusttineMessage() {
      return ['EMAIL', 'WHATSAPP', 'SMS'].includes(this.interaction?.message?.communicationType) &&
      this.interaction?.message?.status !== 'PROCESSED_BY_USER' &&
      this.interaction?.message?.createdBy === 'system' &&
      this.interaction?.direction === 'OUTBOUND'
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
    },

    groupedOccurrences() {
      return this.getGroupedOccurrencesById(this.value?.id)
    },

    coloringType() {
      return this.properties?.OMNICHANNEL_COLORING_TYPE || 'MONOCHROME'
    }
  },

  methods: {
    ...mapActions(['addRecipient', 'verifyRecipient']),

    handleLgpdWarning(ok) {
      if (ok) {
        this.reply()
      }
      this.LGPDWarningDialogVisible = false
    },

    reply(_event) {
      let inReplyTo = null
      if (this.value.interaction?.message?.messageId) {
        inReplyTo = this.value.interaction.message.messageId
      }
      const reply = {
        disputeId: this.$route.params.id,
        type: this.messageType,
        value: this.replyAdress,
        key: 'address',
        inReplyTo
      }
      this.verifyRecipient(reply)
        .then((data) => {
          if (data.value === 'AUTHORIZED') {
            delete reply.disputeId
            this.addRecipient(reply)
          } else {
            this.LGPDWarningDialogVisible = true
          }
        })
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
  flex-wrap: wrap;

  height: auto;
  margin: 10px 24px 0px 24px;

  .break-point {
    flex-basis: 100%;
    width: 0;
  }

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

  .jus-avatar-user {
    align-self: baseline;
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
      min-width: 10vw;
    }

    &.COLORFUL-whatsapp {
      background-color: $--color-whatsapp-bg;
    }
    &.COLORFUL-email {
      background-color: $--color-email-bg;
    }
    &.COLORFUL-negotiation {
      background-color: $--color-negotiator-bg;// $--color-light-gray;
    }
    // &.COLORFUL-EMAIL_CNA {
    //   background-color: #B6FFFB;
    // }
    &.COLORFUL-sms {
      background-color: #ececec;
    }

    &.INBOUND {
      flex-direction: row;
      // background: mix($--color-light-gray, $--color-white, 50%);

      &.NEGOTIATOR {
        // background: mix($--color-light-gray, $--color-white, 50%);
      }
    }

    &.OUTBOUND {
      flex-direction: row-reverse;
    }

    &.MANUAL {
      flex-direction: row-reverse;
    }

    &.SCHEDULED {
      border: 2px dashed $--color-black;
    }

    // &.ballon-email {
    //   border-color: #DFF4FE;
    // }

    // &.ballon-sms {
    //   border-color: #ECECEC;
    // }

    // &.ballon-negotiator-message-2 {
    //   border-color: #FFC5A5;
    // }

    // &.ballon-whatsapp {
    //   border-color: #a3f4c3;
    // }
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
