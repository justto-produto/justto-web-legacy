<template>
  <main
    class="negotiations-container"
  >
    <div
      v-if="showHeader"
      class="negotiations-container__header"
    >
      <TicketsHeader
        target-path="negotiation"
      />

      <HeaderUserMenu />
    </div>

    <div
      class="negotiations-container__body"
      :class="{'with-header': showHeader}"
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
        :style="{ width: disputeId ? '100%' : '0px' }"
      >
        <router-view />
      </section>

      <section
        :class="{ 'hide-section': isInFullScreen }"
        class="negotiations-container__ticket"
        :style="{ width: !disputeId && !isInFullScreen ? '100%' : '0px' }"
      >
        <EmptyTicket :hidden="isInFullScreen || disputeId || showNegotiationTypeMenu" />
      </section>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import Tickets from './partials/tickets/Tickets'
import EmptyTicket from './partials/ticket/TicketEmpty'

export default {
  name: 'Negotiation',

  components: {
    Tickets,
    EmptyTicket,
    TicketsHeader: () => import('./partials/tickets/TicketsHeader.vue'),
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu')
  },

  data: () => ({ internalDisputeId: null }),

  computed: {
    ...mapGetters({
      ticketListMode: 'getTicketListMode',
      showNegotiationTypeMenu: 'showNegotiationTypeMenu'
    }),

    disputeId() {
      return Boolean(this.internalDisputeId) || Boolean(this.$route?.params?.id)
    },

    isInFullScreen() {
      return !this.disputeId && this.ticketListMode === 'MANAGEMENT'
    },

    showHeader() {
      return this.showNegotiationTypeMenu
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
  flex-direction: column;

  .negotiations-container__header {
    display: flex;
    min-height: 40px !important;
    max-height: 40px !important;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid $--color-light-gray;

    .tickets-header-container {
      width: 360px;

      .management-prescriptions {
        margin: 0;
      }
    }
  }

  .negotiations-container__body {
    display: flex;
    height: 100vh;

    .negotiations-container__tickets {
      width: 360px;
      border-right: 1px solid $--color-light-gray;
      -webkit-transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);
      -moz-transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);
      -o-transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);
      transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);

      &.full-section {
        width: 100%;
      }
    }

    .negotiations-container__ticket {
      -webkit-transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);
      -moz-transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);
      -o-transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);
      transition: width .6s cubic-bezier(0.19, 1, 0.22, 1);
      width: calc(100% - 360px);
      overflow: hidden;

      &.hide-section {
        width: 0;
      }
    }

    &.with-header {
      height: calc(100vh - 40px);
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

<style lang="scss">
.negotiations-container {
  .negotiations-container__header {
    .tickets-header-container {
      .management-prescriptions {
        margin: 0;
      }
    }
  }
}
</style>
