<template>
  <section class="overview-info">
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
      />
      <div
        v-else
        class="overview-info__infoline-link"
      >
        <a @click="startEditing(data.key)">Adicionar</a>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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
        paused,
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
        classification
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
          classToEdit: 'ticket'
        },
        {
          key: 'internalId',
          value: internalId,
          component: 'TextInlineEditor',
          classToEdit: 'ticket'
        },
        {
          key: 'strategy',
          value: strategy.id,
          component: 'SelectInlineEditor',
          classToEdit: 'ticket',
          options: this.strategiesOptions
        },
        {
          key: 'status',
          value: this.$options.filters.capitalize(`${this.$t('ticket-status.' + status)} ${this.$tc('ticket-status.PAUSED', paused)}`),
          component: 'TextInlineEditor',
          isEditable: false
        },
        {
          key: 'expireDate',
          value: expireDate?.dateTime,
          component: 'DateInlieEditor',
          classToEdit: 'info'
        },
        {
          key: 'materialDamageValue',
          value: materialDamageValue,
          component: 'CurrencyInlieEditor',
          classToEdit: 'info'
        },
        {
          key: 'moralDamageValue',
          value: moralDamageValue,
          component: 'CurrencyInlieEditor',
          classToEdit: 'info'
        },
        {
          key: 'provisionedValue',
          value: provisionedValue,
          component: 'CurrencyInlieEditor',
          classToEdit: 'info'
        },
        {
          key: 'requestedValue',
          value: requestedValue,
          component: 'CurrencyInlieEditor',
          classToEdit: 'info'
        },
        {
          key: 'configurations',
          value: this.ticketConfigurations,
          component: 'InfoConfigurations',
          classToEdit: 'info'
        },
        {
          key: 'classification',
          value: classification,
          component: 'InfoClassification',
          classToEdit: 'info',
          visible: Boolean(classification && classification.name)
        },
        {
          key: 'description',
          value: description,
          component: 'TextareaInlineEditor',
          classToEdit: 'ticket',
          visible: !strategy.isObrigacaoFazer
        }
      ]
    },
    strategiesOptions() {
      return { list: this.strategies, label: 'name', value: 'id' }
    },
    ticketConfigurations() {
      const {
        skipEnrichment,
        denySavingDeposit,
        businessHoursEngagement,
        awaysContactParty,
        contactPartyWhenNoLawyer,
        contactPartyWhenInvalidLawyer
      } = this.ticketInfo

      return {
        skipEnrichment,
        denySavingDeposit,
        businessHoursEngagement,
        awaysContactParty,
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
      this.$forceUpdate()
      this.$nextTick(() => {
        this.$forceUpdate()
        this.$nextTick(() => {
          this.$refs[key][0].enableEdit()
        })
      })
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
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

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
</style>
