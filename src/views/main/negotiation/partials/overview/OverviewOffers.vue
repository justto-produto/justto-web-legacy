<template>
  <section class="overview-offers">
    <article class="overview-offers__proposal overview-offers__proposal--plaintiff">
      <div>
        Proposta da parte
      </div>
      <div>
        <CurrencyInlieEditor
          v-model="plaintiffProposal.value"
          class="overview-offers__proposal-value overview-offers__proposal-value--full-line"
          @change="updatePlaintiffProposal"
        />
      </div>
    </article>
    <article class="overview-offers__proposal overview-offers__proposal--defendant">
      <div>
        <span>Proposta: </span>
        <CurrencyInlieEditor
          v-model="defendantProposal.value"
          icon-side="left"
          class="overview-offers__proposal-value"
          @change="updateDefendantProposal"
        />
      </div>
      <div>
        <span>Máx: </span>
        <CurrencyInlieEditor
          v-model="upperRange"
          icon-side="left"
          class="overview-offers__proposal-value"
          @change="updateUpperRange"
        />
      </div>
    </article>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OverviewOffers',
  components: {
    CurrencyInlieEditor: () => import('@/components/inputs/CurrencyInlieEditor')
  },
  props: {
    plaintiffProposal: {
      type: Object,
      default: () => ({})
    },
    defendantProposal: {
      type: Object,
      default: () => ({})
    },
    upperRange: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters({
      ticketParties: 'getTicketOverviewParties'
    }),

    disputeId() {
      return Number(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions([
      'sendOffer',
      'setTicketOverview'
    ]),

    updatePlaintiffProposal(value) {
      const { disputeId, plaintiffProposal } = this
      const { roleId } = plaintiffProposal

      const ticketPlaintiffs = this.ticketParties.filter(party => party.polarity === 'CLAIMANT')
      const ticketPlaintiffLawyer = ticketPlaintiffs.filter(party => party.roles.includes('LAWYER'))[0]
      const ticketPlaintiffParty = ticketPlaintiffs.filter(party => party.roles.includes('PARTY'))[0]

      const data = {
        roleid: roleId || (ticketPlaintiffLawyer?.disputeRoleId || ticketPlaintiffParty?.disputeRoleId),
        value,
        note: '',
        updateUpperRage: false
      }

      this.sendOffer({ data, disputeId })
    },

    updateDefendantProposal(value) {
      const { disputeId, plaintiffProposal } = this
      const { roleId } = plaintiffProposal

      const disputeNegotiator = this.ticketParties.filter(party => {
        party.polarity === 'RESPONDENT' &&
        party.roles.includes('NEGOTIATOR')
      })[0]

      const data = {
        roleid: roleId || disputeNegotiator.disputeRoleId,
        value,
        note: '',
        updateUpperRage: false
      }

      this.sendOffer({ data, disputeId })
    },

    updateUpperRange(upperRange) {
      const { disputeId } = this
      const data = { upperRange }

      this.setTicketOverview({ data, disputeId })
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
      max-width: calc(100% - 82px);
      &--full-line {
        max-width: 100% !important;
      }
    }

    & > div:last-child { margin-top: 3px;}

    &--plaintiff {
      border-left: 3px solid $--color-primary;
    }

    &--defendant {
      border-right: 3px solid $--color-secondary;
      text-align: right;
      margin-top: 16px;
    }
  }
}
</style>
