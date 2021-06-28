<template>
  <li
    :class="{ 'communication-ticket-item-container--active': isActive }"
    class="communication-ticket-item-container"
    @click="handleSelectTicket"
  >
    <JusAvatarUser
      :name="plaintiffName"
      :status="ticket.plaintiff ? ticket.plaintiff.status : ''"
      class="communication-ticket-item-container__avatar"
      size="sm"
      purple
    />
    <div class="communication-ticket-item-container__resume">
      <div class="communication-ticket-item-container__parties">
        <span
          :class="{ 'communication-ticket-item-container__plaintiff--danger': !ticket.plaintiff }"
          class="communication-ticket-item-container__plaintiff"
        >
          {{ plaintiffName | resumedName }}
        </span>
        <span class="communication-ticket-item-container__negotiator">
          &gt; {{ ticket.negotiatorName | resumedName }}
        </span>
      </div>
      <el-tooltip
        :open-delay="800"
        :content="lastInboundInteraction.message"
        popper-class="communication-ticket-item-container__message-tooltip"
      >
        <div
          :class="{ 'communication-ticket-item-container__message--bold': !ticket.visualized }"
          class="communication-ticket-item-container__message"
        >
          <JusIcon
            v-if="lastInboundInteraction.icon"
            :icon="lastInboundInteraction.icon"
            class="communication-ticket-item-container__message-icon"
          />
          <span class="communication-ticket-item-container__message-content">
            {{ lastInboundInteraction.message }}
          </span>
        </div>
      </el-tooltip>
    </div>
    <!-- <div class="communication-ticket-item-container__gray" /> -->
    <span
      v-if="(isAcceptedTab || (isFinishedTab && isSettled)) && showDraft"
      class="communication-ticket-item-container__minuta"
    >
      Minuta
    </span>
    <el-steps
      v-if="(isAcceptedTab || (isFinishedTab && isSettled)) && showDraft"
      :active="documentStep"
      finish-status="success"
      class="communication-ticket-item-container__minuta-steps"
      style="width: 100px"
    >
      <el-step />
      <el-step />
      <el-step />
    </el-steps>
    <span
      class="communication-ticket-item-container__time"
    >
      {{ getLastInteraction(lastInboundInteraction.dateTime) }}
    </span>

    <div
      v-if="isFinishedTab"
      class="communication-ticket-item-container__status"
    >
      {{ $t(`occurrence.type.${ticket.disputeStatus}`) | capitalize }}
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDocumentStep } from '@/utils'
import sharedMethods from './patials/sharedTicketdMethods'

export default {
  name: 'CommunicationTicketItem',

  mixins: [sharedMethods],

  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      activeTab: 'getTicketsActiveTab',
      showDraft: 'getIsDraftManagementActive'
    }),
    documentStep() {
      const signStatus = this.ticket?.draftStatus ? this.ticket.draftStatus : this.ticket.signStatus
      return this.getDocumentStep(this.ticket.hasDraft, signStatus)
    },
    isAcceptedTab() {
      return this.activeTab === 'accepted'
    },
    isFinishedTab() {
      return this.activeTab === 'finished'
    },
    isSettled() {
      return this.ticket.disputeStatus === 'SETTLED'
    },
    isActive() {
      return Number(this.$route.params.id) === Number(this.ticket?.disputeId)
    },

    lastInboundInteraction() {
      const { lastInboundInteraction, lastReceivedMessage, disputeStatus, expirationDate, conclusionDate } = this.ticket
      if (this.isAcceptedTab || this.isFinishedTab) {
        if (conclusionDate?.dateTime) {
          return {
            message: 'Disputa ' + this.$t(`ticket-status.${disputeStatus}`),
            dateTime: conclusionDate?.dateTime
          }
        } else {
          return {
            typeMessage: 'Expirada em:',
            message: 'Disputa ' + this.$t(`ticket-status.${disputeStatus}`),
            dateTime: expirationDate.dateTime || '--/--/--'
          }
        }
      } else if (lastInboundInteraction?.type && lastInboundInteraction?.type !== 'COMMUNICATION') {
        const { type, dateTime } = lastInboundInteraction
        return {
          icon: type ? this.$t(`interaction-types.${type}.icon`) : null,
          message: this.$options.filters.capitalize(this.$t(`interaction-types.${type}.message`)),
          dateTime: dateTime.dateTime
        }
      } else if (lastReceivedMessage?.message) {
        const { message, dateTime } = lastReceivedMessage
        return {
          message,
          dateTime: dateTime.dateTime
        }
      } else {
        return {
          typeMessage: 'Expirada em:',
          message: 'Disputa ' + this.$t(`ticket-status.${disputeStatus}`),
          dateTime: expirationDate.dateTime || '--/--/--'
        }
      }
    },

    plaintiffName() {
      const { plaintiff } = this.ticket
      return plaintiff ? plaintiff.name : 'Sem parte'
    }
  },
  methods: {
    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.communication-ticket-item-container {
  position: relative;
  display: flex;
  width: 100%;
  padding: 18px 24px 18px 27px;
  border-left: 6px solid transparent;
  border-bottom: 1px solid $--color-light-gray;
  z-index: 0;
  cursor: pointer;

  &:hover:not(.communication-ticket-item-container--active) {
    background-color: $--color-light-gray;
  }

  &--active {
    background-color: $--color-primary-light-9;
    border-left: 6px solid $--color-primary;
  }

  .communication-ticket-item-container__avatar {
    align-self: center;
  }

  .communication-ticket-item-container__resume {
    margin: 6px 0px 6px 12px;
    flex: 1;

    .communication-ticket-item-container__parties {
      margin-bottom: 6px;

      .communication-ticket-item-container__plaintiff {
        color: $--color-primary;
        font-weight: 700;
        font-size: 16px;
        &--danger { color: $--color-danger; }
      }
      .communication-ticket-item-container__negotiator {
        color: $--color-text-secondary;
        font-size: 13px;
      }
    }

    .communication-ticket-item-container__message {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      max-width: 223px;
      &--bold { font-weight: 600; }
      font-size: 13px;

      .communication-ticket-item-container__message-content {
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
      }

      .communication-ticket-item-container__message-icon {
        width: 14px;
        height: 14px;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
  }

  .communication-ticket-item-container__time {
    position: absolute;
    bottom: 3px;
    right: 18px;
    font-size: 10px;
  }

  .communication-ticket-item-container__status {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 6px;
    font-weight: 500;
    font-size: 12px;
    color: #898686;
    padding: 2px 10px;
    background-color: $--color-light-gray;
    border-radius: 8px;
  }

  .communication-ticket-item-container__minuta {
    position: absolute;
    bottom: 3px;
    left: 78px;
    font-size: 10px;
    color: $--color-primary !important;
    font-weight: 500;
  }

  .communication-ticket-item-container__gray {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #F3F3F3;
    width: 100%;
    height: 20px;
    z-index: -1;
  }
}

@media (max-height: 900px) {
  .communication-ticket-item-container {
    padding: 18px 18px 18px 23px;

    .communication-ticket-item-container__resume {
      margin: 4px 0px 4px 12px;

      .communication-ticket-item-container__parties {
        margin-bottom: 4px;

        .communication-ticket-item-container__plaintiff {
          font-size: 14px;
        }
        .communication-ticket-item-container__negotiator {
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.communication-ticket-item-container__message-tooltip {
  max-width: 400px;
}

.communication-ticket-item-container__minuta-steps {
  position: absolute;
  bottom: 7px;
  left: 122px;
  .el-step {
    .is-success {
      border-color: $--color-primary !important;
      .is-text {
        background-color: $--color-primary !important;;
      }
    }

    .is-wait {
      border-color: #C0C4CC !important;
      color: white !important;
    }

    .is-process {
      border-color: #C0C4CC !important;
      color: white !important;
    }
    .el-step__icon{
      width: 14px;
      height: 14px;
      font-size: 6px;
      color: $--color-primary;
    }
  }
}
</style>
