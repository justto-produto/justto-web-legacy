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
          &lt; {{ ticket.negotiatorName | resumedName }}
        </span>
      </div>
      <div class="communication-ticket-item-container__message">
        {{ ticket.pendingReason || $t(`dispute.status.${ticket.disputeStatus}`) }}
      </div>
    </div>
    <!-- <span class="communication-ticket-item-container__time">
      {{ getLastInteraction(ticket.lastReceivedMessage.dateTime.dateTime) }}
    </span> -->
  </li>
</template>

<script>
import { getLastInteraction } from '@/utils'

export default {
  name: 'TicketItem',
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  computed: {
    isActive() {
      return this.$route.params.id === this.ticket.disputeId
    },
    plaintiffName() {
      const { plaintiff } = this.ticket
      return plaintiff ? plaintiff.name : 'Sem parte'
    }
  },
  methods: {
    hangleSelectTicket() {
      if (!this.isActive) {
        this.$router.push({
          name: 'ticket',
          params: { id: this.ticket.disputeId }
        })
      }
    },
    getLastInteraction(time) {
      return getLastInteraction(time)
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
  border-bottom: 1px solid $--light-gray;
  cursor: pointer;

  &:hover:not(.communication-ticket-item-container--active) {
    background-color: $--light-gray;
  }

  &--active {
    background-color: $--color-primary-light-9;
    border-left: 6px solid $--color-primary;
    // &:after {
    //   content: '';
    //   position: absolute;
    //   display: block;
    //   transform: translateY(-50%);
    //   top: 50%;
    //   right: -10px;
    //   width: 0;
    //   height: 0;
    //   z-index: 99;
    //   border-top: 18px solid transparent;
    //   border-bottom: 18px solid transparent;
    //   border-left: 12px solid green;
    // }
  }

  .communication-ticket-item-container__avatar {
    align-self: center;
    width: 49px;
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
      margin-bottom: 6px;
      max-width: 223px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
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
