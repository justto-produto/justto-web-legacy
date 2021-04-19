<template>
  <section class="overview-offers">
    <article class="overview-offers__proposal overview-offers__proposal--plaintiff">
      <div>
        {{ ['ACCEPTED', 'CHECKOUT'].includes(status) ? 'Valor do acordo' : 'Proposta da parte' }}
      </div>
      <div>
        <CurrencyInlieEditorInner
          v-model="plaintiffOffer.value"
          class="overview-offers__proposal-value overview-offers__proposal-value--full-line"
          @change="updatePlaintiffOffer"
        />
      </div>
    </article>
    <article class="overview-offers__proposal overview-offers__proposal--defendant">
      <div>
        <span>Proposta: </span>
        <CurrencyInlieEditorInner
          v-model="defendantOffer.value"
          icon-side="left"
          class="overview-offers__proposal-value"
          @change="updateDefendantOffer"
        />
      </div>
      <div>
        <span>Máx.: </span>
        <CurrencyInlieEditorInner
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
import preNegotiation from '@/utils/mixins/ticketPreNegotiation'

export default {
  name: 'OverviewOffers',

  components: {
    CurrencyInlieEditorInner: () => import('@/components/inputs/CurrencyInlieEditorInner')
  },

  mixins: [preNegotiation],

  props: {
    plaintiffOffer: {
      type: Object,
      default: () => ({})
    },
    defendantOffer: {
      type: Object,
      default: () => ({})
    },
    upperRange: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      required: true
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

    updatePlaintiffOffer(value) {
      const { disputeId, plaintiffOffer } = this
      const { roleId } = plaintiffOffer

      const ticketPlaintiffs = this.ticketParties.filter(party => party.polarity === 'CLAIMANT')
      const ticketPlaintiffLawyer = ticketPlaintiffs.filter(party => party.roles.includes('LAWYER'))[0]
      const ticketPlaintiffParty = ticketPlaintiffs.filter(party => party.roles.includes('PARTY'))[0]

      const data = {
        roleId: roleId || (ticketPlaintiffLawyer?.disputeRoleId || ticketPlaintiffParty?.disputeRoleId),
        value,
        note: '',
        updateUpperRage: false
      }

      const polarityObjectKey = 'plaintiffOffer'

      this.sendOffer({ data, disputeId, polarityObjectKey })
    },

    updateDefendantOffer(value) {
      const { disputeId, defendantOffer: { roleId } } = this

      const { disputeRoleId } = this.ticketParties.find(({ polarity, roles }) => {
        return polarity === 'RESPONDENT' &&
        roles.includes('NEGOTIATOR')
      })

      const data = {
        defendantProposal: {
          value,
          lastOfferRoleId: roleId || disputeRoleId
        }
      }

      this.setTicketOverview({ disputeId, data })
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
    color: $--color-text-primary;

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

@media (max-height: 900px) {
  .overview-offers {
    .overview-offers__proposal {
      font-size: 14px;

      .overview-offers__proposal-value {
        font-size: 18px;
      }

      &--defendant {
        margin-top: 8px;
      }
    }
  }
}

@media (max-height: 780px) {
  .overview-offers {
    .overview-offers__proposal {
      &--defendant {
        margin-top: 4px;
      }
    }
  }
}
</style>
