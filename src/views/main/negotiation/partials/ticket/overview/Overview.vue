<template>
  <section class="overview-container">
    <i
      :class="{ 'overview-container__button--active': isOverviewActive }"
      class="overview-container__button el-icon-arrow-left"
      @click="$emit('toggle-show-overview')"
    />

    <HeaderUserMenu class="overview-container__menu" />

    <h1 class="overview-container__title show-right-icon">
      #{{ ticket.disputeId }}
      <i
        class="el-icon-copy-document hidden-icon"
        @click="copy(ticket.disputeId)"
      />
    </h1>

    <OverviewOffers
      :defendant-offer="lastOffers.defendantOffer"
      :plaintiff-offer="lastOffers.plaintiffOffer"
      :upper-range="ticket.upperRange"
      :status="ticket.status"
    />

    <OverviewObf
      v-if="ticket.strategy && ticket.strategy.isObrigacaoFazer"
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
  },
  methods: {
    copy(value) {
      navigator.clipboard.writeText(value)
    }
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

  .overview-container__title {
    margin: 0;
  }

  .overview-container__button {
    position: absolute;
    top: 50%;
    left: -20px;
    font-size: 18px;
    background-color: $--color-white;
    padding: 12px 0px;
    border-style: solid;
    border-color: $--light-gray;
    border-width: 1px 0 1px 1px;
    border-radius: 6px 0 0 6px;
    &:before {
      display: block;
      transform: translateY(-50%);
      transition: .6s;
      position: relative;
      top: 8px;
    }
    &--active:before {
      transform: rotate(180deg) translateY(50%) !important;
    }
  }
}

@media (max-height: 900px) {
  .overview-container {
    gap: 12px;

  .overview-container__title {
      font-size: 22px;
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

  .overview-container__button {
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    left: -18px;
    font-size: 18px;
    transition: .6s;
    background-color: $--color-white;
    padding: 12px 0px;
    border-style: solid;
    border-color: $--light-gray;
    border-width: 2px 0 2px 2px;
    border-radius: 6px 0 0 6px;
    &:before {
      transform: translateY(-50%);
    }
    &--active:before {
      transform: rotate(180deg) translateY(50%) !important;
    }
  }
</style>
