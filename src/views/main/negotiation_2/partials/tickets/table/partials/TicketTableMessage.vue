<template>
  <el-tooltip
    :open-delay="800"
    popper-class="ticket-table-message__message-tooltip"
  >
    <span slot="content">
      {{ lastInboundInteraction.message || '' }}
    </span>

    <div
      :class="{ 'ticket-table-message__message--bold': !ticket.visualized }"
      class="ticket-table-message__message"
    >
      <JusIcon
        v-if="lastInboundInteraction.icon"
        :icon="lastInboundInteraction.icon"
        class="ticket-table-message__message-icon"
      />

      <span
        :class="{ 'ticket-table-message__message-content--active': !ticket.visualized }"
        class="ticket-table-message__message-content"
      >
        {{ lastInboundInteraction.message }}
      </span>
    </div>
  </el-tooltip>
</template>

<script>
import lastInboundInteraction from './lastInboundInteraction'
import ticketProp from './ticketProp'

export default {
  mixins: [ticketProp, lastInboundInteraction]
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-table-message__message-tooltip {
  // max-width: 400px;
}

.ticket-table-message__message {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;

  &--bold { font-weight: 600; }

  .ticket-table-message__message-content {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    color: $--color-gray;

    &--active { color: $--color-black; }
  }

  .ticket-table-message__message-icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
    vertical-align: middle;
  }
}
</style>
