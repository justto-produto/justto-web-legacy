<template>
  <td
    :class="{ 'ticket-table-date--active': !ticket.visualized }"
    class="ticket-table-date"
  >
    {{ time }}
  </td>
</template>

<script>
import { getLastInteraction } from '@/utils'
import lastInboundInteraction from './lastInboundInteraction'
import ticketProp from './ticketProp'

export default {
  mixins: [ticketProp, lastInboundInteraction],

  computed: {
    time() {
      if (this.lastInboundInteraction.dateTime) {
        return getLastInteraction(this.lastInboundInteraction.dateTime)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-table-date {
  text-align: right;
  font-size: 10px;
  color: $--color-gray;

  &--active {
    color: $--color-black;
    font-weight: 600;
  }
}
</style>
