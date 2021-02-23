<template>
  <section class="overview-info">
    <div
      v-for="data in dataList"
      v-show="data.value"
      :key="data.key"
      class="overview-info__infoline"
    >
      <span class="overview-info__infoline-label">{{ $t(`ticket-labels.${data.key}`) | capitalize }}:</span>
      <component
        :is="data.component"
        v-model="data.value"
        :is-editable="data.isEditable"
        class="overview-info__infoline-data"
        @change="editData(data.key, $event)"
      />
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OverviewInfo',
  components: {
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    SelectInlineEditor: () => import('@/components/inputs/SelectInlineEditor'),
    CurrencyInlieEditor: () => import('@/components/inputs/CurrencyInlieEditor'),
    DateInlieEditor: () => import('@/components/inputs/DateInlieEditor')
  },
  computed: {
    ...mapGetters({
      ticketInfo: 'getTicketOverviewInfo',
      ticket: 'getTicketOverview'
    }),

    dataList() {
      const { strategy, status, paused } = this.ticket
      const {
        materialDamageValue,
        moralDamageValue,
        provisionedValue,
        requestedValue,
        expireDate,
        importedDate,
        campaignName,
        code
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
          key: 'strategy',
          value: strategy?.name,
          component: 'SelectInlineEditor'
        },
        {
          key: 'status',
          value: this.$options.filters.capitalize(`${this.$t('ticket-status.' + status)} ${this.$tc('ticket-status.PAUSED', paused)}`),
          component: 'TextInlineEditor',
          isEditable: false
        },
        // {
        //   key: 'Valor do acordo',
        //   value: '' // Vai ter?
        // },
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
        }
        // {
        //   key: 'description',
        //   value: this.ticket.description,
        //   visible: () => !strategy?.isObrigacaoFazer
        // },
        // {
        //   key: 'configurations',
        //   value: this.ticketInfo.configurations
        // },
        // {
        //   key: 'classification',
        //   value: this.ticketInfo.classification
        // }
      ]
    }
  },
  methods: {
    editData(key, value) {
      console.log(key, value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-info {
  .overview-info__infoline {
    margin-top: 6px;

    .overview-info__infoline-label {
      font-size: 13px;
      line-height: normal;
      color: $--color-text-secondary;
    }

    .overview-info__infoline-data {
      margin: 3px 0px 3px 18px;
      line-height: normal;
    }
  }
}
</style>
