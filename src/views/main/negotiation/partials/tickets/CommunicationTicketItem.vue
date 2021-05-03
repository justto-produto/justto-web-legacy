<template>
  <li
    :class="{ 'communication-ticket-item-container--active': isActive }"
    class="communication-ticket-item-container"
    @click="hangleSelectTicket"
  >
    <JusAvatarUser
      :name="plaintiffName"
      :status="ticket.plaintiff ? ticket.plaintiff.status : ''"
      class="communication-ticket-item-container__avatar"
      size="md"
      shadow
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
    <span class="communication-ticket-item-container__time">
      {{ getLastInteraction(lastInboundInteraction.dateTime) }}
    </span>
  </li>
</template>

<script>
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
    isActive() {
      return Number(this.$route.params.id) === this.ticket.disputeId
    },
    lastInboundInteraction() {
      const { lastInboundInteraction, lastReceivedMessage, disputeStatus, expirationDate } = this.ticket

      if (lastInboundInteraction?.type !== 'COMMUNICATION') {
        const { type, dateTime } = lastInboundInteraction
        return {
          icon: this.$t(`interaction-types.${type}.icon`),
          message: this.$options.filters.capitalize(this.$t(`interaction-types.${type}.message`)),
          dateTime: dateTime.dateTime
        }
      } else if (lastReceivedMessage && lastReceivedMessage.message) {
        const { message, dateTime } = lastReceivedMessage
        return {
          message,
          dateTime: dateTime.dateTime
        }
      } else {
        return {
          // icon: this.$t(`ticket-status.${disputeStatus}.icon`),
          message: 'Disputa ' + this.$t(`ticket-status.${disputeStatus}`),
          dateTime: expirationDate || '--/--/--'
        }
      }
    },
    plaintiffName() {
      const { plaintiff } = this.ticket
      return plaintiff ? plaintiff.name : 'Sem parte'
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
  z-index: 0;
  cursor: pointer;

  &:hover:not(.communication-ticket-item-container--active) {
    background-color: $--color-light-gray;
  }

  &--active {
    background-color: $--color-primary-light-9;
    border-left: 6px solid $--color-primary;
    // &:after {
    //   content: '';
    //   position: absolute;
    //   display: flex;
    //   transform: translateY(-50%);
    //   top: 50%;
    //   right: 0px;
    //   width: 0;
    //   height: 0;
    //   border-top: 49px solid transparent;
    //   border-bottom: 49px solid transparent;
    //   border-right: 8px solid $--color-white;
    // }
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

      .communication-ticket-item-container__message-content {
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
      }

      .communication-ticket-item-container__message-icon {
        width: 16px;
        height: 16px;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
  }

  .communication-ticket-item-container__time {
    position: absolute;
    bottom: 9px;
    right: 18px;
    font-size: 12px;
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
.communication-ticket-item-container__message-tooltip {
  max-width: 400px;
}
</style>
