<template>
  <section class="overview-container">
    <i
      :class="{ 'overview-container__button--active': isOverviewActive }"
      class="overview-container__button el-icon-arrow-left el-icon-arrow-left"
      @click="$emit('toggle-show-overview')"
    />

    <HeaderUserMenu class="overview-container__menu" />

    <h1 style="margin: 0">
      #{{ ticket.disputeId }}
    </h1>

    <OverviewOffers
      :defendant-offer="lastOffers.defendantOffer"
      :plaintiff-offer="lastOffers.plaintiffOffer"
      :upper-range="ticket.upperRange"
      :status="ticket.status"
    />

    <OverviewObf
      v-if="ticket.strategy.isObrigacaoFazer"
      v-model="ticket.description"
    />

    <OverviewTabs />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Overview',
  components: {
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu'),
    OverviewOffers: () => import('./OverviewOffers'),
    OverviewObf: () => import('./OverviewObf'),
    OverviewTabs: () => import('./OverviewTabs')
  },
  props: {
    showOverview: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    innerWidth: window.innerWidth
  }),
  computed: {
    ...mapGetters({
      ticket: 'getTicketOverview',
      lastOffers: 'getLastTicketOffers'
    }),

    isOverviewActive() {
      return this.innerWidth > 1200 ? !this.showOverview : this.showOverview
    }
  },
  beforeMount() {
    window.addEventListener('resize', event => {
      this.innerWidth = event.target.innerWidth
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-container {
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;

  .overview-container__button {
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    left: -18px;
    font-size: 18px;
    transition: .6s;
    &--active { transform: rotate(180deg) translateY(50%); }
  }
}

@media (max-height: 680px) {
  .overview-container {
    padding: 6px 24px !important;

    .overview-container__menu {
      height: 40px !important;
    }
  }
}

@media (max-width: 900px) {
  .overview-container {
    .overview-container__header {
      display: none;
    }
  }
}
</style>
