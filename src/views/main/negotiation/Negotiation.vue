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
      <EmptyTicket :hidden="isInFullScreen || disputeId" />
    </section>

    <TableMenu v-if="showNegotiationTypeMenu && !disputeId" />
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
      ticketListMode: 'getTicketListMode',
      showNegotiationTypeMenu: 'showNegotiationTypeMenu'
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
    -webkit-transition: width 1s ease-in-out;
    -moz-transition: width 1s ease-in-out;
    -o-transition: width 1s ease-in-out;
    transition: width 1s ease-in-out;

    &.full-section {
      width: 100%;
    }
  }

  .negotiations-container__ticket {
    -webkit-transition: width 1.1s ease-in-out;
    -moz-transition: width 1.1s ease-in-out;
    -o-transition: width 1.1s ease-in-out;
    transition: width 1.1s ease-in-out;
    width: calc(100% - 360px);
    overflow: hidden;

    &.hide-section {
      width: 0;
    }
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
