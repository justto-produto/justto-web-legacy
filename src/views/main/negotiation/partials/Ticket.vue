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
.ticket-container {
  background-color: white;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 99vh;

  .ticket-omnichannel {
    background-color: transparent;
    margin-top: 6px;
    border: solid whitesmoke 2px;
    border-radius: 6px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 40px calc(100% - 40px - 6px - 2px);
  }

  .ticket-overview {
    background-color: transparent;
  }
}
</style>
