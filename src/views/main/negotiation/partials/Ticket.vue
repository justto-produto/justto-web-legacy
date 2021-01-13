<template>
  <section
    id="ticket-negotiation-container"
    class="ticket-container"
  >
    <section class="ticket-omnichannel">
      <ticket-header class="ticket-negotiation__header" />
      <omnichannel class="ticket-negotiation__omnichannel" />
    </section>
    <section class="ticket-overview">
      <overview class="ticket-negotiation__overview" />
    </section>
  </section>
</template>

<script>
export default {
  name: 'Ticket',
  components: {
    Omnichannel: () => import('./omnichannel/Omnichannel'),
    Overview: () => import('./overview/Overview'),
    TicketHeader: () => import('./TicketHeader')
  }
}
</script>

<style lang="scss" scoped>
$header-height: 40px;
$omnichannel-height: calc(100vh - 40px);

.ticket-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 100vh;

  .ticket-omnichannel {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: $header-height $omnichannel-height;
  }
}
</style>
