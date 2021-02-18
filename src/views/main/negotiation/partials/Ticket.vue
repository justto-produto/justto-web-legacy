<template>
  <section
    id="ticket-negotiation-container"
    class="ticket-container"
  >
    <section class="ticket-container__omnichannel">
      <TicketHeader @toggle-show-overview="toggleShowOverview" />
      <Omnichannel />
    </section>

    <section
      class="ticket-container__overview"
      :class=" { 'ticket-container__overview--active': showOverview }"
    >
      <Overview
        :show-overview="showOverview"
        @toggle-show-overview="toggleShowOverview"
      />
    </section>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Ticket',
  components: {
    Omnichannel: () => import('./omnichannel/Omnichannel'),
    Overview: () => import('./overview/Overview'),
    TicketHeader: () => import('./TicketHeader')
  },
  data: () => ({
    showOverview: false
  }),
  watch: {
    '$route.params.id'() {
      this.fetchData()
    }
  },
  beforeMount() {
    this.fetchData()
  },
  methods: {
    ...mapActions([
      'getTicketOverview',
      'getLastTicketOffers'
    ]),

    fetchData() {
      const disputeId = this.$route.params.id
      this.getTicketOverview(disputeId)
      this.getLastTicketOffers(disputeId)
    },

    toggleShowOverview() {
      this.showOverview = !this.showOverview
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-container {
  display: flex;
  position: relative;

  .ticket-container__omnichannel {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .ticket-container__overview {
    width: 310px;
    border-left: 1px solid $--light-gray;
    transition: .6s cubic-bezier(0.19, 1, 0.22, 1);
    // &--active { width: 0; }
  }
}

@media (max-width: 1200px) {
  .ticket-container {
    overflow-x: hidden;

    .ticket-container__overview {
      position: absolute;
      z-index: 99;
      right: 0;
      transform: translateX(100%);
      width: 300px;
      &--active {
        transform: translateX(0);
      }
    }
  }
}

@media (max-width: 600px) {
  .ticket-container {
    .ticket-container__overview {
      width: calc(100% - 48px);
    }
  }
}

</style>
