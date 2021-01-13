<template>
  <section
    id="ticket-negotiation-container"
    class="ticket-negotiation">
    <header class="ticket-negotiation__header" />
    <article class="ticket-negotiation__omnichanel">
      <Omnichannel />
    </article>
    <aside class="ticket-negotiation__overview">
      <Overview />
    </aside>
  </section>
</template>

<script>
export default {
  name: 'Ticket',
  components: {
    Omnichannel: () => import('./omnichannel/Omnichannel'),
    Overview: () => import('./overview/Overview')
  }
}
</script>

<style lang="scss" scoped>
.ticket-negotiation {
  display: flex;
  // flex-direction: column;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: space-between;

  .ticket-negotiation__header {
    justify-self: flex-start;
    height: 78px;
    background-color: white;

    @media (max-height: 680px) {
      height: 60px;
    }
  }

  .ticket-negotiation__omnichanel {
    justify-self: flex-end;
    height: 100%;
  }

  .ticket-negotiation__overview {
    height: 30vh;
    justify-self: flex-end;
  }

}
</style>
