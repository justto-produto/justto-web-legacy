<template>
  <div
    :class="`${direction}`"
    class="interaction-container__info"
  >
    <GroupedOccurrences
      :have="!hideGrouping && haveGroupedOccurrences"
      :occurrences="groupedOccurrences"
      :parent-id="occurrence.id"
    />

    <el-tooltip :content="statusTooltip">
      <jus-icon :icon="statusIcon" />
    </el-tooltip>

    <div>
      •
    </div>

    <span v-html="formatedTime" />

    <div v-if="interactionIcon.length && isGrouping">
      •
    </div>

    <jus-icon
      v-if="interactionIcon.length && isGrouping"
      :icon="interactionIcon"
      :class="{'NEGOTIATOR': (value.type || '').startsWith('NEGOTIATOR')}"
    />

    <div v-if="(messageReceiver || messageParameters) && isGrouping && !isManual && !isAttachment">
      •
    </div>

    <span v-if="messageReceiver && direction === 'OUTBOUND' && isGrouping">
      Para: {{ messageReceiver | phoneNumber }}
    </span>

    <span v-if="messageParameters && direction === 'INBOUND' && isGrouping">
      Por:
      <span v-if="![messageSender, messageParameters.SENDER].includes(messageParameters.SENDER_NAME)">
        {{ messageParameters.SENDER_NAME }} ({{ messageSender | phoneNumber }})
      </span>

      <span v-else>
        {{ messageSender | phoneNumber }}
      </span>
    </span>

    <el-tooltip
      v-if="direction === 'INBOUND' && isGrouping && value.message.communicationType === 'WHATSAPP'"
      content="Baixar anexo."
      placement="top-start"
    >
      <el-button
        class="communication-container__download"
        type="text"
        icon="el-icon-download"
        @click="handleDownload"
      />
    </el-tooltip>
  </div>
</template>

<script>
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'
import { mapGetters } from 'vuex'

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
    },

    hideGrouping: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      isGrouping: 'isOmnichannelGrouping'
    }),

    interaction() {
      return this.value
    },

    direction() {
      const isProposal = ['MANUAL_COUNTERPROPOSAL', 'MANUAL_PROPOSAL'].includes(this.value.type)

      return isProposal ? 'OUTBOUND' : this.value?.direction || ''
    },

    messageReceiver() {
      return this.value?.message?.receiver || ''
    },

    messageParameters() {
      return this.value?.message?.parameters || {}
    },

    messageSender() {
      return this.value?.message?.sender || this.messageParameters.SENDER
    },

    statusTooltip() {
      return 'No momento desta ocorrência, esta disputa estava ' + this.$tc('dispute.status.' + this.occurrence.status)
    },

    statusIcon() {
      return this.occurrence?.status?.toLowerCase() || ''
    },

    interactionIcon() {
      const isNegotiatorMessage = [
        'NEGOTIATOR_PROPOSAL',
        'NEGOTIATOR_REJECTED',
        'NEGOTIATOR_ACCEPTED',
        'NEGOTIATOR_CHECKOUT',
        'NEGOTIATOR_ACCESS'
      ].includes(String(this.value?.type))

      if (this.value?.type === 'CLICK') return 'click'

      if (this.value?.type === 'VISUALIZATION') return 'eye'

      if (this.value?.message?.communicationType) return String(this.value.message.communicationType).replace('_', '-').toLowerCase()

      if (isNegotiatorMessage) return 'justto'

      if (this.occurrence?.type === 'LOG') {
        const description = this.occurrence?.description.toLowerCase()

        if (description.includes('disputa dada como ganha')) return 'win'
        if (description.includes('disputa pausada')) return 'pause'
        if (description.includes('disputa alterada para perdido')) return 'lose'
        if (description.includes('reiniciou o engajamento')) return 'refresh'
        if (description.includes('disputa retomada')) return 'start-again'
        if (description.includes('disputa marcada como em análise pela empresa')) return 'offices-tower-active'
        if (description.includes('disputa desmarcada como em análise pela empresa')) return 'offices-tower'
        if (description.includes('disputa expirou')) return 'calendar-clock'
        if (description.includes('disputa expirada')) return 'calendar-clock'
      }

      return ''
    },

    formatedTime() {
      const { createAt, updateAt } = this.occurrence

      return this.$moment((updateAt || createAt).dateTime).format('HH:mm')
    },

    isManual() {
      return (this.value?.type || '').includes('MANUAL')
    },

    isAttachment() {
      return (this.value?.type || '').includes('ATTACHMENT')
    }
  },

  methods: {
    handleDownload() {
      const { message: { content } } = this.value

      window.open(content, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.interaction-container__info {
  display: flex;
  flex-direction: row;
  gap: 0;
  margin: -12px 50px 8px;
  white-space: nowrap;
  word-break: break-word;
  flex-wrap: wrap;

  div {
    margin: 0 4px;
  }

  img {
    width: 16px;
  }

  span {
    font-weight: 300;
    word-break: break-word;
    white-space: normal;
  }

  &.OUTBOUND {
    flex-direction: row-reverse;

    span {
      text-align: right;
    }
  }

  &.INBOUND {
    margin-left: 4px;

    span {
      text-align: left;
    }
  }
}

.interaction-container {
  &.MANUAL {
    .interaction-container__info {
      &.OUTBOUND {
        margin-right: 4px;
      }
    }
  }

  .communication-container__download {
    padding: 0;
    color: $--color-black;
    margin-left: 4px;

    &::before {
      content: '• ';
    }
  }
}
</style>
