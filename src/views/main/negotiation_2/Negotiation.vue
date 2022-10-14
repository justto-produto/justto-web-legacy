<template>
  <main
    class="negotiations-container"
  >
    <Tickets
      :class="{
        'hide-section': disputeId,
        'full-section': isInFullScreen
      }"
      class="negotiations-container__tickets"
      :full-screen="isInFullScreen"
    />

    <section
      :class="{ 'hide-section': isInFullScreen }"
      class="negotiations-container__ticket"
    >
      <router-view v-if="disputeId" />
      <EmptyTicket v-else-if="!isInFullScreen" />
    </section>

    <TableMenu v-if="!disputeId" />
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Negotiation',
  components: {
    Tickets: () => import('./partials/tickets/Tickets'),
    EmptyTicket: () => import('./partials/ticket/TicketEmpty'),
    TableMenu: () => import('./partials/tickets/table/partials/TableMenu')
  },

  computed: {
    ...mapGetters({
      ticketListMode: 'getTicketListMode'
    }),

    disputeId() {
      return this.$route?.params?.id
    },

    isInFullScreen() {
      return !this.disputeId && this.ticketListMode === 'MANAGEMENT'
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
