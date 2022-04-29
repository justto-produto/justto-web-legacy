<template>
  <section class="overview-offers">
    <article
      class="overview-offers__status"
    >
      <el-tag :class="status">
        {{ $tc(`occurrence.type.${status}`) }}
      </el-tag>
      <span
        v-if="isPaused"
        class="overview-offers__status-paused"
      >
        PAUSADO
      </span>
    </article>

    <article
      v-if="isAccepted"
      class="overview-offers__proposal overview-offers__proposal--accepted"
    >
      <!-- <JusIcon icon="ticket-accepted" /> -->
      <div overview-offers__proposal>
        <div class="overview-offers__proposal-container">
          <div>&nbsp;</div>

          <CurrencyInlieEditorInner
            v-if="acceptedValue > 0"
            v-model="acceptedValue"
            :is-editable="canEditPlaintiffOffer"
            class="overview-offers__proposal-value overview-offers__proposal-value--full-line"
            @change="updatePlaintiffOffer"
          />

          <CurrencyInlieEditorInner
            v-else
            v-model="plaintiffOffer.value"
            :is-editable="canEditPlaintiffOffer"
            class="overview-offers__proposal-value overview-offers__proposal-value--full-line"
            @change="updatePlaintiffOffer"
          />

          <el-popover
            placement="top-end"
            trigger="hover"
            content="this is content, this is content, this is content"
            :open-delay="500"
            :close-delay="500"
          >
            <div>
              <span>Sua proposta: </span>
              <CurrencyInlieEditorInner
                v-model="defendantOffer.value"
                :is-editable="false"
                icon-side="left"
                class="overview-offers__proposal-value"
                @change="updateDefendantOffer"
              />
              <br>
              <span>{{ $tc('UPPER_RANGE', isRecoveryStrategy) }}:</span>
              <CurrencyInlieEditorInner
                v-model="upperRange"
                :is-editable="false"
                icon-side="left"
                class="overview-offers__proposal-value"
                @change="updateUpperRange"
              />
            </div>

            <i
              slot="reference"
              class="el-icon-info"
            />
          </el-popover>
        </div>
      </div>
    </article>

    <article
      v-if="!isAccepted"
      class="overview-offers__proposal overview-offers__proposal--plaintiff"
    >
      <div>
        {{ ['ACCEPTED', 'CHECKOUT'].includes(status) ? 'Valor do acordo' : ( isRecoveryStrategy ? 'Proposta do réu' : 'Proposta da parte') }}
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

    <article
      v-if="!isAccepted"
      class="overview-offers__proposal overview-offers__proposal--defendant"
    >
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
        <span>{{ $tc('UPPER_RANGE', isRecoveryStrategy) }}:</span>
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
    acceptedValue: {
      type: Number,
      default: () => (0)
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
      ticket: 'getTicketOverview',
      isRecoveryStrategy: 'isWorkspaceRecovery'
    }),

    isPaused() {
      return this.ticket.paused
    },

    isCanceled() {
      const { status } = this.ticket
      return status === 'CANCELED'
    },

    isAccepted() {
      return ['SETTLED', 'ACCEPTED', 'CHECKOUT'].includes(this.ticket.status)
    },

    disputeId() {
      return Number(this.$route.params.id)
    },

    canEditPlaintiffOffer() {
      const { status } = this
      return ['ENGAGEMENT', 'PENDING', 'RUNNING', 'IMPORTED', 'ENRICHED'].includes(status) && !this.isCanceled && !this.isPaused
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
      if (this.upperRange === 0 || (this.isRecoveryStrategy ? value < this.upperRange : value > this.upperRange)) {
        const tag = this.$createElement

        const text = `Valor da contraproposta é ${this.isRecoveryStrategy ? 'menor' : 'maior'} que o ${'d' + this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecoveryStrategy)}!`

        this.$confirm(tag('div', null, [
          tag('p', null, text),
          tag('br', null, ''),
          tag('p', null, [
            tag('span', { style: { color: '#FF4B54' } }, '*'),
            tag('small', null, [
              'Ao clicar em ',
              tag('strong', null, this.isRecoveryStrategy ? 'Ajustar' : 'Majorar'),
              ', será feita a ',
              tag('strong', null, 'contraproposta'),
              ', a ',
              tag('strong', null, this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecoveryStrategy)),
              ' será ' + (this.isRecoveryStrategy ? 'ajustada' : 'majorada') + ' para o ',
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
              tag('strong', null, (this.isRecoveryStrategy ? 'Não ajustar' : 'Não majorar')),
              ', somente será feita a contraproposta, sem alterações no status da disputa.'
            ])
          ])
        ]), `${this.isRecoveryStrategy ? 'Ajustar' : 'Majorar'} ${this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecoveryStrategy)}?`, {
          distinguishCancelAndClose: true,
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
          confirmButtonText: (this.isRecoveryStrategy ? 'Não ajustar' : 'Não majorar'),
          cancelButtonText: (this.isRecoveryStrategy ? 'Ajustar' : 'Majorar')
        }).then(() => {
          const { disputeId } = this

          this.sendOffer({ data, disputeId, polarityObjectKey })
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

    // Ajusta proposta da empresa.
    updateDefendantOffer(value) {
      if (this.upperRange === 0) {
        return
      }
      const polarityObjectKey = 'defendantOffer'
      const { disputeId } = this
      let data
      if (this.isRecoveryStrategy ? value < this.upperRange : value > this.upperRange) {
        data = this.mountObjectToChangeUpperRangeAndDefendantProposal(value, true)
        this.$confirm(`${this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecoveryStrategy)} é de R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(this.upperRange)} e sua nova proposta é de R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value)}. Ao continuar esta operação, você <strong>irá ${this.isRecoveryStrategy ? 'ajustar' : 'majorar'}</strong> ${this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecoveryStrategy)}.<br> Deseja continuar?`, `Proposta ${this.isRecoveryStrategy ? 'abaixo' : 'acima'} d${this.$tc('UPPER_RANGE_WITH_ARTICLE', this.isRecoveryStrategy)}`, {
          confirmButtonText: 'Continuar e ' + (this.isRecoveryStrategy ? 'ajustar' : 'majorar'),
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
            message: `Sua proposta foi ajustada para a ${this.$tc('UPPER_RANGE', this.isRecoveryStrategy)}!`,
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

    div span {
      font-size: 14px !important;
    }

    .overview-offers__proposal-value {
      font-size: 16px !important;
      font-weight: 400;
      max-width: calc(100% - 82px);

      &--full-line {
        max-width: 100% !important;
      }
    }

    .overview-offers__proposal-container {
      display: flex;
      gap: 8px;
      align-items: center;

      i.el-icon-info {
        opacity: 0;
        cursor: pointer;
        font-size: 14px;
      }
    }

    &:hover {
      .overview-offers__proposal-container {
        i.el-icon-info {
          transition: opacity 0.5s ease-out;
          opacity: 1;
        }
      }
    }

    div:last-child { margin-top: 3px;}

    &--plaintiff {
      border-left: 3px solid $--color-primary;
    }

    &--defendant {
      border-right: 3px solid $--color-secondary;
      text-align: right;
      margin-top: 16px;
    }

    &--accepted {
      text-align: center;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 16px;

      div {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }

  .overview-offers__status {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin: 0 0 8px 0;

    .el-tag {
      text-transform: uppercase;
      font-weight: 600;

      &.RUNNING {
        background-color: #feecfc;
        color: #ce1ec0;
        border-color: #ce1ec0;
      }

      &.CANCELED,
      &.IMPORTED,
      &.ENRICHED,
      &.EXPIRED {
        background-color: #f1f1f3;
        color: #898686;
        border-color: #898686;
      }

      &.PRE_NEGOTIATION {
        background-color: #fefaec;
        color: #cec71e;
        border-color: #cec71e;
      }

      &.PENDING, &.ENGAGEMENT {
        background-color: #fff1c8;
        color: #ff9300;
        border-color: #ff9300;
      }

      &.ACCEPTED {
        background-color: #ecf8fe;
        color: #1ecec0;
        border-color: #1ecec0;
      }

      &.CHECKOUT {
        background-color: #eceefe;
        color: #1e54ce;
        border-color: #1e54ce;
      }

      &.UNSETTLED {
        background-color: #ffe4e5;
        color: #ff4b54;
        border-color: #ff4b54;
      }

      &.SETTLED {
        background-color: #ecfeee;
        color: #1ece39;
        border-color: #1ece39;
      }
    }

    .overview-offers__status-paused {
      color: $--color-secondary;
      font-weight: 600;
      font-size: 12px;
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
