<template>
  <section class="overview-info">
    <div
      v-for="data in dataList"
      :key="data.key"
      class="overview-info__infoline"
    >
      <span class="overview-info__infoline-label">{{ $t(`ticket-labels.${data.key}`) | capitalize }}:</span>
      <component
        :is="data.component"
        v-if="data.value || activeAddingData === data.key"
        :ref="data.key"
        v-model="data.value"
        :is-editable="data.isEditable"
        :options="data.options"
        class="overview-info__infoline-data"
        @change="editData(data.key, $event)"
        @blur="stopEditing"
      />
      <a
        v-else
        class="overview-info__infoline-link"
        @click="startEditing(data.key)"
      >
        Adicionar
      </a>
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
    DateInlieEditor: () => import('@/components/inputs/DateInlieEditor')
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
        strategy,
        status,
        paused,
        code,
        internalId
      } = this.ticket
      const {
        materialDamageValue,
        moralDamageValue,
        provisionedValue,
        requestedValue,
        expireDate,
        importedDate,
        campaignName
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
          component: 'TextInlineEditor'
        },
        {
          key: 'internalId',
          value: internalId,
          component: 'TextInlineEditor'
        },
        {
          key: 'strategy',
          value: strategy?.id,
          component: 'SelectInlineEditor',
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
          component: 'DateInlieEditor'
        },
        {
          key: 'materialDamageValue',
          value: materialDamageValue,
          component: 'CurrencyInlieEditor'
        },
        {
          key: 'moralDamageValue',
          value: moralDamageValue,
          component: 'CurrencyInlieEditor'
        },
        {
          key: 'provisionedValue',
          value: provisionedValue,
          component: 'CurrencyInlieEditor'
        },
        {
          key: 'requestedValue',
          value: requestedValue,
          component: 'CurrencyInlieEditor'
        },
        {
          key: 'description',
          value: this.ticket.description,
          component: 'TextareaInlineEditor'
          // visible: () => !strategy?.isObrigacaoFazer
        }
        // {
        //   key: 'configurations',
        //   value: this.ticketInfo.configurations
        // },
        // {
        //   key: 'classification',
        //   value: this.ticketInfo.classification
        // }
      ]
    },
    strategiesOptions() {
      return { list: this.strategies, label: 'name', value: 'id' }
    },
    disputeId() {
      return Number(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions(['setTicketOverview']),

    editData(key, value) {
      const { disputeId } = this
      const data = { [key]: value }
      this.setTicketOverview({ data, disputeId })
    },
    startEditing(key) {
      this.activeAddingData = key
      console.log(key, this.$refs)
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs[key][0].enableEdit()
        }, 5)
      })
    },
    stopEditing(value) {
      if (!value) this.activeAddingData = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-info {
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
      margin: 3px 0px 3px 18px;
      line-height: normal;
      display: block;
    }

    .overview-info__infoline-link {
      border-bottom: 2px solid transparent;
    }
  }
}
</style>
