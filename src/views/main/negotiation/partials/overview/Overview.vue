<template>
  <section
    id="overviewOmnichanelNegotiatorContainer"
    class="overview-container"
  >
    <i
      :class="{ 'overview-container__button--active': showOverview }"
      class="overview-container__button el-icon-arrow-left el-icon-arrow-left"
      @click="$emit('toggle-show-overview')"
    />

    <HeaderUserMenu />

    <h1 style="margin: 0">
      #{{ ticket.disputeId }}
    </h1>

    <OverviewOffers
      :defendant-proposal="ticket.defendantProposal"
      :plaintiff-proposal="ticket.plaintiffProposal"
      :upper-range="ticket.upperRange"
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
  computed: {
    ...mapGetters({
      ticket: 'getTicketOverview'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-container {
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

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

@media (max-width: 900px) {
  .overview-container {
    .overview-container__header {
      display: none;
    }
  }
}
</style>
