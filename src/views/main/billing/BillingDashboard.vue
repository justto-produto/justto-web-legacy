<template>
  <jus-view-main
    :loading-container="false"
    full-screen
    class="billing-view">
    <div
      slot="main"
      class="billing-view__slot-main">

      <article class="billing-view__range">
        <h2 class="billing-view__range-title">
          Cobrança do período
        </h2>
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
        :columns="4"
        class="billing-view__cards">
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
      filterTransactions: {
        icon: 'eye',
        label: 'Ver lançamentos',
        trigger: 'showTransactions',
      },
      filterDisputes: {
        icon: 'management',
        label: 'Filtrar gerenciamento',
        trigger: 'showDisputes',
      },
      addTransaction: {
        icon: 'add',
        label: 'Novo lançamento',
        trigger: 'addTransaction',
      },
    }
  },
  computed: {
    ...mapGetters([
      'billingDashboard',
      'isJusttoAdmin',
      'transactions',
      'workspaceId',
    ]),

    dataCards() {
      if (this.billingDashboard.length) {
        return this.billingDashboard.map(data => {
          if (data.type === 'OTHERS') {
            return { data, actions: [this.addTransaction] }
          } else if (data.type === 'SUBSCRIPTION') {
            return { data }
          } else {
            return { data, actions: [this.filterTransactions, this.filterDisputes] }
          }
        })
      }
    },

    totalCard() {
      let revenue = 0
      for (const d of this.billingDashboard) revenue += d.revenue
      return { title: 'total', revenue }
    },

    initialDateRange() {
      return [
        this.$moment(new Date()).startOf('month').format('YYYY-MM-DD'),
        this.$moment(new Date()).endOf('month').format('YYYY-MM-DD'),
      ]
    },
  },
  beforeCreate() {
    if (!this.isJusttoAdmin) this.$router.go(-1)
  },
  beforeMount() {
    this.dateRange[0] = this.initialDateRange[0]
    this.dateRange[1] = this.initialDateRange[1]
    this.clearTransactionsQuery(this.initialDateRange)
    this.setWorkspaceId(this.workspaceId)
    this.getBillingDashboard()
  },
  methods: {
    ...mapActions([
      'cancelTransaction',
      'clearTransactionsQuery',
      'getBillingDashboard',
      'setRangeDate',
      'setTerm',
      'setType',
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
      this.setType(evt.eventProps.customProps.type)
    },

    showDisputesAction(evt) {
      let type = ''
      switch (evt.eventProps.customProps.type) {
        case 'IMPORTED_DISPUTE':
          type = 'IMPORTED'
          break
        case 'SETTLED_DISPUTE':
          type = 'SETTLED'
          break
        case 'INTERACTION':
          type = 'RUNNING'
          break
        case 'DISPUTE_ACCEPTED':
          type = 'ACCEPTED'
          break
        default:
          type = ''
      }
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('updateDisputeQuery', { key: 'status', value: type })
      // this.$store.commit('updateDisputeQuery', { key: 'transactionType', value: evt.eventProps.customProps.type })
      this.$store.commit('setDisputeHasFilters', true)
      this.$store.commit('setDisputesTab', '3')
      this.$router.push('/management')
    },

    addTransactionAction(evt) {

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
    display: grid;    
    grid-template-rows: repeat(2, auto) 1fr;
    gap: 20px;

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

      .billing-view__range-title {
        margin: 0px;
        font-size: 24px;
      }
    }

    .billing-view__table {
      padding-top: 12px;
      display: grid;
      gap: 8px;
      grid-template-rows: auto 1fr;
      overflow: hidden;

      .billing-view__table-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;

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
        width: 298px;

        .el-icon-date, .el-range__close-icon {
          display: none;
        }

        .el-range-input, .el-range-separator {
          font-size: 24px;
          font-weight: bold;
          color: $--color-primary;
          cursor: pointer;
        }

        .el-range-input {
          width: 140px
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
