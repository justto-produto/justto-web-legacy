<template>
  <section class="overview-info">
    <div class="overview-info-fields">
      <div
        v-for="data in dataList"
        v-show="data.visible !== false"
        :key="data.key"
        class="overview-info__infoline"
      >
        <span class="overview-info__infoline-label">
          {{ $t(`ticket-labels.${data.key}`) | capitalize }}:
        </span>
        <component
          :is="data.component"
          v-if="data.value || activeAddingData === data.key"
          :ref="data.key"
          v-model="data.value"
          :is-editable="data.isEditable"
          :options="data.options"
          class="overview-info__infoline-data"
          @change="setData(data.key, data.classToEdit, $event)"
          @blur="stopEditing"
          @enableEdit="enableEdit"
        />
        <div
          v-else-if="data.isEditable !== false"
          class="overview-info__infoline-link"
        >
          <a @click="startEditing(data.key)">Adicionar</a>
        </div>
      </div>
    </div>

    <el-button
      type="primary"
      size="small"
      icon="el-icon-edit"
      @click="editDispute"
    >
      Editar disputa
    </el-button>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import preNegotiation from '@/utils/mixins/ticketPreNegotiation'

export default {
  name: 'OverviewInfo',

  components: {
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    SelectInlineEditor: () => import('@/components/inputs/SelectInlineEditor'),
    CurrencyInlieEditor: () => import('@/components/inputs/CurrencyInlieEditor'),
    TextareaInlineEditor: () => import('@/components/inputs/TextareaInlineEditor'),
    DateInlieEditor: () => import('@/components/inputs/DateInlieEditor'),
    InfoConfigurations: () => import('./info/InfoConfigurations'),
    InfoClassification: () => import('./info/InfoClassification')
  },

  mixins: [preNegotiation],

  props: {
    disputeMode: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    activeAddingData: ''
  }),

  computed: {
    ...mapGetters({
      ticketInfo: 'getTicketOverviewInfo',
      ticket: 'getTicketOverview',
      strategies: 'getMyStrategiesLite'
    }),

    dataList() {
      const {
        status,
        code,
        internalId,
        strategy,
        description
      } = this.ticket
      const {
        materialDamageValue,
        moralDamageValue,
        provisionedValue,
        requestedValue,
        expireDate,
        importedDate,
        campaignName,
        classification,
        courtHearingDate
      } = this.ticketInfo

      return [
        {
          key: 'importedDate',
          value: importedDate?.dateTime,
          component: 'DateInlieEditor',
          isEditable: false
        },
        {
          key: 'campaignName',
          value: campaignName,
          component: 'TextInlineEditor',
          isEditable: false
        },
        {
          key: 'code',
          value: code,
          component: 'TextInlineEditor',
          classToEdit: 'ticket',
          isEditable: !this.isPreNegotiation
        },
        {
          key: 'internalId',
          value: internalId,
          component: 'TextInlineEditor',
          classToEdit: 'ticket',
          isEditable: !this.isPreNegotiation
        },
        {
          key: 'strategy',
          value: strategy.id,
          component: 'SelectInlineEditor',
          classToEdit: 'ticket',
          isEditable: !this.isPreNegotiation,
          options: this.strategiesOptions
        },
        {
          key: 'status',
          value: this.$options.filters.capitalize(`${this.$t('occurrence.type.' + status)}`),
          component: 'TextInlineEditor',
          isEditable: false
        },
        {
          key: 'upperRange',
          value: this.ticket.upperRange,
          component: 'CurrencyInlieEditor',
          isEditable: false
        },
        // TODO: SAAS-4353 Implementar listagem de Propostas/Contrapropostas aqui.
        {
          key: 'expireDate',
          value: expireDate?.dateTime,
          component: 'DateInlieEditor',
          classToEdit: 'info',
          isEditable: !this.isPreNegotiation,
          isDateTimeFormat: false
        },
        {
          key: 'courtHearingDate',
          value: courtHearingDate?.dateTime || '',
          component: 'DateInlieEditor',
          classToEdit: 'info',
          isEditable: true,
          isDateTimeFormat: false
        },
        {
          key: 'materialDamageValue',
          value: materialDamageValue,
          component: 'CurrencyInlieEditor',
          classToEdit: 'info',
          isEditable: !this.isPreNegotiation
        },
        {
          key: 'moralDamageValue',
          value: moralDamageValue,
          component: 'CurrencyInlieEditor',
          classToEdit: 'info',
          isEditable: !this.isPreNegotiation
        },
        {
          key: 'provisionedValue',
          value: provisionedValue,
          component: 'CurrencyInlieEditor',
          isEditable: !this.isPreNegotiation,
          classToEdit: 'info'
        },
        {
          key: 'requestedValue',
          value: requestedValue,
          component: 'CurrencyInlieEditor',
          isEditable: !this.isPreNegotiation,
          classToEdit: 'info'
        },
        {
          key: 'configurations',
          value: this.ticketConfigurations,
          component: 'InfoConfigurations',
          isEditable: !this.isPreNegotiation,
          classToEdit: 'info'
        },
        {
          key: 'classification',
          value: classification,
          component: 'InfoClassification',
          isEditable: !this.isPreNegotiation,
          classToEdit: 'info',
          visible: Boolean(classification && classification.name)
        },
        {
          key: 'description',
          value: description,
          component: 'TextareaInlineEditor',
          isEditable: !this.isPreNegotiation,
          classToEdit: 'ticket',
          visible: !strategy.isObrigacaoFazer
        }
      ]
    },
    strategiesOptions() {
      const hasStrategyInOptions = this.ticket?.strategy.id && this.strategies.map(({ id }) => id).includes(this.ticket?.strategy.id)

      return {
        list: [
          ...this.strategies,
          ...(hasStrategyInOptions ? [] : [{
            id: this.ticket?.strategy.id,
            name: 'Estratégia Indisponível',
            disabled: true
          }])
        ],
        label: 'name',
        value: 'id'
      }
    },
    ticketConfigurations() {
      const {
        skipEnrichment,
        denySavingDeposit,
        businessHoursEngagement,
        alwaysContactParty,
        contactPartyWhenNoLawyer,
        contactPartyWhenInvalidLawyer
      } = this.ticketInfo

      return {
        skipEnrichment: !skipEnrichment,
        denySavingDeposit,
        businessHoursEngagement,
        alwaysContactParty,
        contactPartyWhenNoLawyer,
        contactPartyWhenInvalidLawyer
      }
    },
    disputeId() {
      return Number(this.$route.params.id)
    }
  },

  methods: {
    ...mapActions([
      'setTicketOverview',
      'setTicketOverviewInfo'
    ]),

    editDispute() {
      this.$emit('dispute')
    },

    setData(key, classToEdit, value) {
      const { disputeId } = this
      const data = { [key]: value }

      if (classToEdit === 'info') {
        this.setTicketOverviewInfo({ data, disputeId })
      } else {
        this.setTicketOverview({ data, disputeId })
      }
    },

    startEditing(key) {
      this.activeAddingData = key
    },

    enableEdit() {
      const { activeAddingData } = this
      if (activeAddingData) this.$refs[activeAddingData][0].enableEdit()
    },

    stopEditing() {
      this.activeAddingData = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-info {
  padding-top: 2px;
  height: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: space-between;

  .overview-info-fields {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    .overview-info__infoline {
      margin-top: 6px;

      .overview-info__infoline-label {
        font-size: 13px;
        line-height: normal;
        color: $--color-text-secondary;
      }

      .overview-info__infoline-data,
      .overview-info__infoline-link {
        margin: 3px 0 3px 18px;
        line-height: normal;
      }

      .overview-info__infoline-link {
        border-bottom: 2px solid transparent;
      }
    }
  }

  .el-button {
    display: flex;
    width: 100%;
    justify-content: center;
  }
}
</style>
