<template>
  <li>
    {{ ticket.disputeId }}
  </li>
</template>

<script>
export default {
  name: 'TicketItem',
  props: {
    ticket: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
