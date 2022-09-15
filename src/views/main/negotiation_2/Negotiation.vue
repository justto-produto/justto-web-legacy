<template>
  <main
    class="negotiations-container"
  >
    <Tickets
      :class="{
        'hide-section': disputeId,
        'full-section': !disputeId
      }"
      class="negotiations-container__tickets"
      :full-screen="!disputeId"
    />

    <section
      v-if="disputeId"
      :class="{ 'hide-section': !disputeId }"
      class="negotiations-container__ticket"
    >
      <router-view v-if="disputeId" />
      <!-- <EmptyTicket v-else /> -->
    </section>
  </main>
</template>

<script>
export default {
  name: 'Negotiation',
  components: {
    Tickets: () => import('./partials/tickets/Tickets')
    // EmptyTicket: () => import('./partials/ticket/TicketEmpty')
  },

  computed: {
    disputeId() {
      return this.$route?.params?.id
    }
  },

  mounted() {
    this.$jusSegment('ACCESS_NEGOTIATION', {})
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.negotiations-container {
  display: flex;
  overflow: hidden;
  flex: 1;

  .negotiations-container__tickets {
    width: 360px;
    border-right: 1px solid $--color-light-gray;

    &.full-section {
      width: 100%;
    }
  }

  .negotiations-container__ticket {
    flex: 1;
  }
}

@media (max-width: 900px) {
  .negotiations-container {
    .hide-section {
      display: none;
    }

    .negotiations-container__tickets {
      width: 100%;
      max-width: 100%;
      border-right: none;
    }

    .negotiations-container__ticket {
      width: 100%;
      max-width: 100%;
    }
  }
}
</style>
