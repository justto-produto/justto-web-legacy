<template>
  <jus-view-main
    :loading-container="false"
    full-screen
    class="billing-view">
    <div
      slot="main"
      class="billing-view__slot-main">

      <article class="billing-view__range">
        <h2>Cobrança do período</h2>
        <el-date-picker
          v-model="dateRange"
          :clearable="false"
          type="daterange"
          align="right"
          format="dd/MM/yyyy"
          unlink-panels
          range-separator="-"
          start-placeholder="Data inicial"
          end-placeholder="Data final"
          value-format="yyyy-MM-dd"
          class="billing-view__range-input"
          @input="filterByRangeDate"
        />
      </article>

      <jus-grid
        :rows="2"
        :columns="4">
        <jus-financial-card
          v-grid-item.col-1.row-1
          v-grid-item.col-1.row-2:v-if="index === 6"
          v-for="(card, index) in dataCards"
          :key="index"
          :data="card.data"
          :actions="card.actions"
          @cardAction="handlerAction"
        />
        <jus-financial-card
          v-grid-item.col-1.row-2
          :data="totalCard"
          highlighted
        />
      </jus-grid>

      <article class="billing-view__table">
        <div class="billing-view__table-header">
          <el-input
            v-model="searchTerm"
            class="billing-view__table-filter-input"
            prefix-icon="el-icon-search"
            placeholder="Buscar"
            size="small"
            clearable
            @input="filterByTerm"
          />
          <span class="billing-view__table-filter-counter">
            Exibindo {{ transactions.content.length }} de {{ transactions.totalElements }} resultados
          </span>
        </div>
        <el-card
          class="billing-view__table-body"
          shadow="never">
          <JusDataTable
            :data="transactions.content"
            class="billing-view__data-table"
            @floatAction="handlerAction"
          />
        </el-card>
      </article>

    </div>
  </jus-view-main>
</template>

<script>
import { GridItem } from '@/utils/directives/JusGridItem'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'BillingDashboard',
  directives: { GridItem },
  components: {
    JusDataTable: () => import('@/components/tables/JusDataTable'),
    JusFinancialCard: () => import('@/components/JusFinancialCard/JusFinancialCard'),
    JusGrid: () => import('@/components/JusGrid/JusGrid'),
  },
  data() {
    return {
      dateRange: [],
      searchTerm: '',
      mainActions: [
        {
          icon: 'eye',
          label: 'Ver lançamentos',
          trigger: 'showTransactions',
        },
        {
          icon: 'management',
          label: 'Filtrar gerenciamento',
          trigger: 'showDisputes',
        },
      ],
      secondaryActions: [
        {
          icon: 'add',
          label: 'Novo lançamento',
          trigger: 'addTransaction',
        },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'billingDashboard',
      'transactions',
      'workspaceId',
    ]),

    dataCards() {
      return this.billingDashboard.map(data => {
        const showable = ['imports', 'dealsSettled', 'monthlyFees', 'interactions', 'dealsAccepted']
        if (showable.includes(data.title)) {
          return { data, actions: this.mainActions }
        } return { data, actions: this.secondaryActions }
      }).filter(card => card.data.title !== 'overall')
    },

    totalCard() {
      return this.billingDashboard.filter(data => {
        return data.title === 'overall'
      })[0]
    },
  },
  beforeMount() {
    this.dateRange[0] = this.$moment(new Date()).startOf('month').format('YYYY-MM-DD')
    this.dateRange[1] = this.$moment(new Date()).endOf('month').format('YYYY-MM-DD')
    this.setRangeDate(this.dateRange)
    this.setWorkspaceId(this.workspaceId)
    this.getBillingDashboard()
  },
  methods: {
    ...mapActions([
      'getBillingDashboard',
      'cancelTransaction',
      'setTerm',
      'setType',
      'setRangeDate',
      'setWorkspaceId',
    ]),

    filterByTerm() {
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.setTerm(this.searchTerm)
      }, 800)
    },

    filterByRangeDate() {
      clearTimeout(this.rangeDebounce)
      this.rangeDebounce = setTimeout(() => {
        this.setRangeDate(this.dateRange)
      }, 800)
    },

    handlerAction(evt) {
      const action = evt.eventProps.trigger + 'Action'
      this[action](evt)
    },

    showTransactionsAction(evt) {
      const type = this.$t(`billingFilters.${evt.eventProps.customProps.title}`)
      this.setType(type)
    },

    showDisputesAction(evt) {
      const type = this.$t(`billingFilters.${evt.eventProps.customProps.title}`)
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('updateDisputeQuery', { key: 'status', value: type })
      this.$store.commit('setDisputeHasFilters', true)
      this.$store.commit('setDisputesTab', '3')
      this.$router.push('/management')
    },

    addTransaction(evt) {

    },

    cancelTransactionAction(evt) {
      this.$prompt('Insira o motivo do cancelamento', 'Cancelar lançamento', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
      }).then(({ value }) => {
        this[evt.eventProps.trigger]({
          id: evt.eventProps.customProps.id,
          data: { reason: value },
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.billing-view {
  .billing-view__slot-main {
    height: 100%;

    .billing-view__range {
      display: flex;
      align-items: center;
      justify-content: center;

      .billing-view__range-input {
        border: none !important;

        .el-range-input {
          font-size: 30px;
          font-weight: bold !important;
        }
      }
    }

    .billing-view__table {
      height: 50% !important;

      .billing-view__table-body {
        height: 100% !important;
      }

      .billing-view__table-header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;

        .billing-view__table-filter-input  {
          width: 300px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.billing-view {
  .billing-view__slot-main {
    .billing-view__range {
      .billing-view__range-input {
        padding: 4px 0;
        margin-left: 8px !important;
        width: 278px;

        .el-icon-date, .el-range__close-icon {
          display: none;
        }

        .el-range-input, .el-range-separator {
          font-size: 22px;
          font-weight: bold;
          color: $--color-primary;
          cursor: pointer;
        }

        .el-range-input {
          width: 130px
        }

        .el-range-separator {
          width: 18px;
        }
      }
    }

    .billing-view__table {
      .billing-view__table-body {
        .el-card__body {
          padding: 16px;
          height: 100%;
        }
      }
    }
  }

  .el-card__body {
    height: 100%;
  }
}
</style>
