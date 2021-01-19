<template>
  <li
    :class="{ 'communication-ticket-item-container--active': isActive }"
    class="communication-ticket-item-container"
    @click="hangleSelectTicket"
  >
    <JusAvatarUser
      :name="ticket.plaintiff.name"
      :status="ticket.plaintiff.status"
      class="communication-ticket-item-container__avatar"
      size="md"
      shadow
      purple
    />
    <div class="communication-ticket-item-container__resume">
      <div class="communication-ticket-item-container__parties">
        <span class="communication-ticket-item-container__plaintiff">
          {{ ticket.plaintiff.name | resumedName }}
        </span>
        <span class="communication-ticket-item-container__negotiator">
          &gt; {{ ticket.negotiatorName | resumedName }}
        </span>
      </div>
      <div class="communication-ticket-item-container__message">
        {{ ticket.lastReceivedMessage.message }}
      </div>
    </div>
    <span class="communication-ticket-item-container__time">
      {{ getLastInteraction(ticket.lastReceivedMessage.dateTime.dateTime) }}
    </span>
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
    }
  },
  methods: {
    hangleSelectTicket() {
      this.$router.push({
        name: 'ticket',
        params: { id: this.ticket.disputeId }
      })
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
  border-left: 3px solid transparent;
  border-bottom: 1px solid $--light-gray;
  cursor: pointer;

  &:hover:not(.communication-ticket-item-container--active) {
    background-color: $--light-gray;
  }

  &--active {
    background-color: $--color-primary-light-9;
    border-left: 3px solid $--color-primary;
    // &:after {
    //   content: '';
    //   position: absolute;
    //   display: flex;
    //   transform: translateY(-50%);
    //   top: 50%;
    //   right: -5px;
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
    // width: 49px;
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
      }
      .communication-ticket-item-container__negotiator {
        color: $--color-text-secondary;
        font-size: 13px;
      }
    }

    .communication-ticket-item-container__message {
      margin-bottom: 6px;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      // overflow: hidden;
    }
  }

  .communication-ticket-item-container__time {
    position: absolute;
    bottom: 9px;
    right: 18px;
    font-size: 12px;
  }
}
</style>
