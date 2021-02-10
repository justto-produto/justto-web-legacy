<template>
  <section class="overview-offers">
    <article class="overview-offers__proposal overview-offers__proposal--plaintiff">
      <div>
        Proposta da parte
      </div>
      <div>
        <span class="overview-offers__proposal-value">{{ plaintiffProposal.value | currency }}</span>
      </div>
    </article>
    <article class="overview-offers__proposal overview-offers__proposal--defendant">
      <div>
        Proposta:
        <span class="overview-offers__proposal-value">{{ defendantProposal.value | currency }}</span>
      </div>
      <div>
        Max:
        <span class="overview-offers__proposal-value">{{ ticket.upperRange | currency }}</span>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  name: 'OverviewOffers',
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  computed: {
    defendantProposal() {
      return this.ticket.defendantProposal
    },
    plaintiffProposal() {
      return this.ticket.plaintiffProposal
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-offers {
  height: auto;

  .overview-offers__proposal {
    padding: 6px 12px;
    font-weight: 500;
    font-size: 16px;
    color: $--color-text-regular;

    .overview-offers__proposal-value {
      font-size: 20px;
      font-weight: 400;

    }

    & > div:last-child { margin-top: 3px;}

    &--plaintiff {
      border-left: 3px solid $--color-primary;
    }

    &--defendant {
      border-right: 3px solid $--color-secondary;
      text-align: right;
      margin-top: 18px;
    }
  }
}
</style>
