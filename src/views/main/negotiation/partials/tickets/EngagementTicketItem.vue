<template>
  <li
    :class="{ 'communication-ticket-item-container--active': isActive }"
    class="communication-ticket-item-container"
    @click="handleSelectTicket"
  >
    <div class="communication-ticket-item-container__resume">
      <div class="communication-ticket-item-container__parties">
        <span
          :class="{ 'communication-ticket-item-container__plaintiff--danger': !ticket.plaintiff }"
          class="communication-ticket-item-container__plaintiff"
        >
          {{ plaintiffName | resumedName }}
        </span>
        <span class="communication-ticket-item-container__negotiator">
          &lt; {{ ticket.negotiatorName | resumedName }}
        </span>
      </div>
      <div class="communication-ticket-item-container__message">
        <el-tooltip
          :disabled="!isInPreNegotiaionTab"
          :open-delay="250"
          :placement="'bottom-start'"
        >
          <div
            slot="content"
            v-html="resumeReason"
          />
          <span>
            {{ isInPreNegotiaionTab ? reason : resumeReason }}
          </span>
        </el-tooltip>
      </div>
    </div>
    <div
      v-if="ticket.plaintiff && ticket.plaintiff.status === 'ONLINE'"
      class="communication-ticket-item-container__online"
    />
    <div
      v-if="activeTab === 'engagement'"
      class="communication-ticket-item-container__status"
    >
      {{ $t(`occurrence.type.${ticket.disputeStatus}`) | capitalize }}
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'
import preNegotiation from '@/utils/mixins/ticketPreNegotiation'

import sharedMethods from './patials/sharedTicketdMethods'

export default {
  name: 'TicketItem',

  mixins: [preNegotiation, sharedMethods],

  props: {
    ticket: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      activeTab: 'getTicketsActiveTab'
    }),

    isActive() {
      return Number(this.$route.params?.id || '') === Number(this.ticket?.disputeId)
    },

    plaintiffName() {
      const { plaintiff } = this.ticket
      return plaintiff ? plaintiff.name : 'Sem parte'
    },

    isInPreNegotiaionTab() {
      return this.activeTab === 'pre-negotiation'
    },

    reason() {
      const { pendingReason, disputeStatus } = this.ticket
      if (pendingReason?.keywords) {
        return pendingReason.keywords.join(', ')
      } else if (pendingReason?.description) {
        return pendingReason?.description
      } else {
        return this.$options.filters.capitalize(this.$tc(`dispute.status.${disputeStatus}`))
      }
    },

    resumeReason() {
      const { pendingReason, disputeStatus } = this.ticket
      if (pendingReason?.description) {
        return pendingReason.description
      } else {
        return this.$options.filters.capitalize(this.$tc(`dispute.status.${disputeStatus}`))
      }
    }
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
      font-size: 13px;
      margin-bottom: 6px;
      max-width: 223px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
    }

  }

  .communication-ticket-item-container__online {
    position: absolute;
    top: 25px;
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $--color-success;
  }

  .communication-ticket-item-container__gray {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #F3F3F3;
    width: 100%;
    height: 20px;
    z-index: 1;
  }

  .communication-ticket-item-container__time {
    position: absolute;
    bottom: 9px;
    right: 18px;
    font-size: 12px;
  }

  .communication-ticket-item-container__status {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 6px;
    font-weight: 500;
    font-size: 12px;
    color: #898686;
    padding: 0px 10px;
    background-color: $--color-light-gray;
    border-radius: 8px;
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
