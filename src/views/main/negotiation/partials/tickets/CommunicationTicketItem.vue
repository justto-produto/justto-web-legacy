<template>
  <li
    :class="{ 'communication-ticket-item-container--active': isActive }"
    class="communication-ticket-item-container"
    @click="handleSelectTicket"
  >
    <div class="communication-ticket-item-container__resume">
      <div class="communication-ticket-item-container__parties">
        <span
          v-if="hasLawyer"
          :class="{
            'communication-ticket-item-container__plaintiff--text-complete': isSelfCause,
            'communication-ticket-item-container__plaintiff--active': !ticket.visualized
          }"
          class="communication-ticket-item-container__plaintiff"
        >
          <el-tooltip
            placement="top"
            :open-delay="500"
          >
            <span slot="content">
              {{ isSelfCause ? 'Advogado e Parte' : 'Advogado' }}
            </span>

            <JusIcon
              :icon="isSelfCause ? 'party-lawyer-icon' : 'lawyer-icon'"
              :is-active="!ticket.visualized"
            />
          </el-tooltip>

          <el-tooltip
            placement="top"
            :open-delay="500"
          >
            <span slot="content">
              {{ lawyerName }}
            </span>

            <div>
              {{ lawyerName | resumedName }}
            </div>
          </el-tooltip>
        </span>

        <span
          v-if="!isSelfCause"
          :class="{
            'communication-ticket-item-container__plaintiff--text-complete': !hasLawyer,
            'communication-ticket-item-container__plaintiff--active': !ticket.visualized
          }"
          class="communication-ticket-item-container__plaintiff"
        >

          <el-tooltip
            placement="top"
            :open-delay="500"
          >
            <span slot="content">
              {{ 'Parte' }}
            </span>

            <JusIcon
              icon="party-icon"
              :is-active="!ticket.visualized"
            />
          </el-tooltip>

          <el-tooltip
            placement="top"
            :open-delay="500"
          >
            <span slot="content">
              {{ plaintiffName }}
            </span>

            <div>
              {{ plaintiffName | resumedName }}
            </div>
          </el-tooltip>
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
          <span
            :class="{ 'communication-ticket-item-container__message-content--active': !ticket.visualized }"
            class="communication-ticket-item-container__message-content"
          >
            {{ lastInboundInteraction.message }}
          </span>
        </div>
      </el-tooltip>
    </div>

    <span
      v-if="(isAcceptedTab || (isFinishedTab && isSettled)) && showDraft"
      :class="{ 'communication-ticket-item-container__minuta--active': !ticket.visualized }"
      class="communication-ticket-item-container__minuta"
    >
      Minuta
    </span>

    <el-steps
      v-if="(isAcceptedTab || (isFinishedTab && isSettled)) && showDraft"
      :active="documentStep"
      finish-status="success"
      :class="{ 'communication-ticket-item-container__minuta-steps--active': !ticket.visualized }"
      class="communication-ticket-item-container__minuta-steps"
      style="width: 100px"
    >
      <el-step />
      <el-step />
      <el-step />
    </el-steps>

    <JusIcon
      v-if="isOnline"
      class="communication-ticket-item-container__online"
      icon="online"
    />

    <span
      :class="{ 'communication-ticket-item-container__time--active': !ticket.visualized }"
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
      display: flex;
      gap: 24px;
      justify-content: flex-start;
      align-items: center;

      .communication-ticket-item-container__plaintiff {
        display: flex;
        align-items: baseline;
        gap: 8px;
        color: $--color-gray;
        font-size: 14px;
        width: calc(50% - 12px);

        div.el-tooltip {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-x: hidden;
        }

        &--text-complete { width: 100%; }

        &--danger { color: $--color-danger; }

        &--active {
          color: $--color-primary-dark;
          font-weight: 700;
        }
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
        color: $--color-gray;

        &--active {
          color: $--color-black;
        }
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
    color: $--color-gray;

    &--active {
      color: $--color-black;
      font-weight: 600;
    }
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
    left: 35px;
    font-size: 10px;
    color: $--color-gray;
    font-weight: 500;

    &--active {
      color: $--color-primary !important;
      font-weight: 600;
    }
  }

  .communication-ticket-item-container__online {
    position: absolute;
    top: 25px;
    left: 15px;
    width: 10px;
    height: 10px;
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
      width: 100%;

      .communication-ticket-item-container__parties {
        margin-bottom: 4px;
        width: 100%;

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
  left: 80px;

  .el-step {
    .is-success {
      border-color: $--color-gray !important;

      .is-text {
        background-color: $--color-gray !important;;
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

    .el-step__icon {
      width: 14px;
      height: 14px;
      font-size: 6px;
      color: $--color-gray;
    }
  }

  &--active .el-step{
    .is-success {
      border-color: $--color-primary !important;

      .is-text {
        background-color: $--color-primary !important;;
      }
    }

    .el-step__icon {
      color: $--color-primary;
    }
  }
}
</style>
