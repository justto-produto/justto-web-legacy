<template>
  <section class="overview-offers">
    <article class="overview-offers__proposal overview-offers__proposal--plaintiff">
      <div>
        {{ ['ACCEPTED', 'CHECKOUT'].includes(status) ? 'Valor do acordo' : 'Proposta da parte' }}
      </div>
      <div>
        <CurrencyInlieEditorInner
          v-model="plaintiffOffer.value"
          :is-editable="canEditPlaintiffOffer"
          class="overview-offers__proposal-value overview-offers__proposal-value--full-line"
          @change="updatePlaintiffOffer"
        />
      </div>
    </article>
    <article class="overview-offers__proposal overview-offers__proposal--defendant">
      <div>
        <span>Sua proposta: </span>
        <CurrencyInlieEditorInner
          v-model="defendantOffer.value"
          :is-editable="!isPreNegotiation && upperRange > 0"
          icon-side="left"
          class="overview-offers__proposal-value"
          @change="updateDefendantOffer"
        />
      </div>
      <div>
        <span>Alçada Máx.: </span>
        <CurrencyInlieEditorInner
          v-model="upperRange"
          :is-editable="!isPreNegotiation"
          icon-side="left"
          class="overview-offers__proposal-value"
          @change="updateUpperRange"
        />
      </div>
    </article>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
      ticketParties: 'getTicketOverviewParties',
      ticket: 'getTicketOverview'
    }),

    disputeId() {
      return Number(this.$route.params.id)
    },

    canEditPlaintiffOffer() {
      const { status } = this
      return ['ENGAGEMENT', 'PENDING', 'RUNNING', 'IMPORTED', 'ENRICHED'].includes(status)
    }
  },
  methods: {
    ...mapActions([
      'sendOffer',
      'setTicketOverview',
      'setTicketOverviewDefendantProposal'
    ]),

    ...mapMutations({
      updateTicketOverview: 'updateTicketOverview'
    }),

    updatePlaintiffOffer(value) {
      const polarityObjectKey = 'plaintiffOffer'
      const { disputeId, plaintiffOffer } = this
      const { roleId } = plaintiffOffer

      const ticketPlaintiffs = this.ticketParties.filter(party => party.polarity === 'CLAIMANT')
      const ticketPlaintiffLawyer = ticketPlaintiffs.filter(party => party.roles.includes('LAWYER'))[0]
      const ticketPlaintiffParty = ticketPlaintiffs.filter(party => party.roles.includes('PARTY'))[0]

      const data = {
        roleId: roleId || (ticketPlaintiffLawyer?.disputeRoleId || ticketPlaintiffParty?.disputeRoleId),
        value,
        note: '',
        updateUpperRange: false
      }
      if (this.upperRange === 0) {
        const tag = this.$createElement
        this.$confirm(tag('div', null, [
          tag('p', null, 'Valor da contraproposta é maior que o da alçada máxima!'),
          tag('br', null, ''),
          tag('p', null, [
            tag('span', { style: { color: '#FF4B54' } }, '*'),
            tag('small', null, [
              'Ao clicar em ',
              tag('strong', null, 'Majorar'),
              ', será feita a ',
              tag('strong', null, 'contraproposta'),
              ', a ',
              tag('strong', null, 'alçada máxima'),
              ' será majorada para o ',
              tag('strong', null, 'valor'),
              ' da contraproposta e a disputa será alterada para ',
              tag('strong', null, 'Proposta Aceita'),
              '.'
            ])
          ]),
          tag('br', null, ''),
          tag('p', null, [
            tag('span', { style: { color: '#FF4B54' } }, '*'),
            tag('small', null, [
              'Ao clicar em ',
              tag('strong', null, 'Não majorar'),
              ', somente será feita a contraproposta, sem alterações no status da disputa.'
            ])
          ])
        ]), 'Majorar a alçada máxima?', {
          distinguishCancelAndClose: true,
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
          confirmButtonText: 'Não majorar',
          cancelButtonText: 'Majorar'
        }).catch(() => {
          const { disputeId } = this
          const updateUpperRangeObj = { upperRange: value }
          data.updateUpperRange = true
          this.sendOffer({ data, disputeId, polarityObjectKey })
            .then(() => this.updateTicketOverview({ payload: { ...updateUpperRangeObj } }))
        })
      } else {
        this.sendOffer({ data, disputeId, polarityObjectKey })
      }
    },

    updateDefendantOffer(value) {
      if (this.upperRange === 0) {
        return
      }
      const polarityObjectKey = 'defendantOffer'
      const { disputeId } = this
      let data
      if (value > this.upperRange) {
        data = this.mountObjectToChangeUpperRangeAndDefendantProposal(value, true)
        this.$confirm(`A alçada máxima é de R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(this.upperRange)} e sua nova proposta é de R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value)}. Ao continuar esta operação, você <strong>irá majorar</strong> a alçada máxima.<br> Deseja continuar?`, 'Proposta acima da alçada', {
          confirmButtonText: 'Continuar e majorar alçada',
          cancelButtonText: 'Cancelar',
          cancelButtonClass: 'is-plain',
          showClose: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.setTicketOverview({ data, disputeId })
        })
      } else {
        data = this.mountObjectToChangeUpperRangeAndDefendantProposal(value, false)
        this.setTicketOverviewDefendantProposal({ disputeId, data, polarityObjectKey })
      }
    },

    updateUpperRange(upperRange) {
      if (upperRange === 0) {
        return
      }
      let data = { upperRange }
      const { disputeId } = this
      const alterDefendantProposal = upperRange < this.defendantOffer.value
      if (alterDefendantProposal) {
        data = this.mountObjectToChangeUpperRangeAndDefendantProposal(upperRange, true)
      }
      this.setTicketOverview({ data, disputeId }).then(() => {
        if (alterDefendantProposal) {
          this.$jusNotification({
            title: 'Hey!',
            message: 'Sua proposta foi reduzada para a alçada máxima!',
            type: 'warning'
          })
        }
      })
    },

    mountObjectToChangeUpperRangeAndDefendantProposal(value, isUpperRange) {
      const { defendantOffer: { roleId } } = this
      const defendantOfferName = this.defendantOffer.name
      const { disputeRoleId, name } = this.ticketParties.find(({ polarity, roles }) => {
        return polarity === 'RESPONDENT' &&
        roles.includes('NEGOTIATOR')
      })
      const obj = {
        value: value,
        defendantProposal: {
          value: value,
          name: defendantOfferName || name,
          lastOfferRoleId: roleId || disputeRoleId
        }
      }
      if (isUpperRange) obj.upperRange = value
      return obj
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
