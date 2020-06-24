<template>
  <jus-view-main
    :loading-container="false"
    full-screen
    class="billing-view"
  >
    <div
      slot="main"
      class="billing-view__slot-main"
    >

      <JusButtonBack
        to="/billing"
        class="billing-view__back-button"
      />

      <JusButtonBack
        to="/billing"
        class="billing-view__back-button"
      />

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
        class="billing-view__cards"
        flow="column">
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
            Exibindo {{ transactionsList.length }} de {{ transactions.totalElements || 0 }} resultados
          </span>
        </div>
        <el-card
          class="billing-view__table-body"
          shadow="never"
        >
          <JusDataTable
            :data="transactionsList"
            class="billing-view__data-table"
            @floatAction="handlerAction"
          />
        </el-card>
      </article>

      <el-dialog
        :close-on-click-modal="false"
        :show-close="false"
        :visible.sync="addTransactionDialogVisable"
        title="Novo Lançamento"
        width="50%">
        <el-form
          v-loading="modalLoading"
          ref="addTransactionForm"
          :model="addTransactionForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="Valor"
                prop="value">
                <money
                  v-model="addTransactionForm.value"
                  class="el-input__inner"
                  maxlength="16"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Data"
                prop="occurredDate">
                <el-date-picker
                  v-model="addTransactionForm.occurredDate"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  type="date"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item
                label="Nota"
                prop="note">
                <el-input
                  v-model="addTransactionForm.note"
                  type="textarea"
                  rows="4"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button
            :disabled="modalLoading"
            @click="addTransactionDialogVisable = false">Cancelar</el-button>
          <el-button
            :loading="modalLoading"
            type="primary"
            @click.prevent="addTransaction()">Continuar</el-button>
        </div>
      </el-dialog>

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
    JusButtonBack: () => import('@/components/buttons/JusButtonBack'),
  },
  data() {
    return {
      dateRange: [],
      searchTerm: '',
      filterTransactionsActionParams: {
        icon: 'eye',
        label: 'Ver lançamentos',
        trigger: 'showTransactions',
      },
      filterDisputesActionParams: {
        icon: 'management',
        label: 'Filtrar gerenciamento',
        trigger: 'showDisputes',
      },
      addTransactionActionParams: {
        icon: 'add',
        label: 'Novo lançamento',
        trigger: 'addTransaction',
      },
      addTransactionDialogVisable: false,
      modalLoading: false,
      addTransactionForm: {
        value: '',
        note: '',
        occurredDate: '',
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

    transactionsList() {
      return this.transactions.content ? this.transactions.content : []
    },

    dataCards() {
      if (this.billingDashboard.length) {
        return this.billingDashboard.map(data => {
          if (data.type === 'OTHERS') {
            return { data, actions: [this.filterTransactionsActionParams, this.addTransactionActionParams] }
          } else if (data.type === 'SUBSCRIPTION') {
            return { data, actions: [this.filterTransactionsActionParams] }
          } else {
            return { data, actions: [this.filterTransactionsActionParams, this.filterDisputesActionParams] }
          }
        })
      }

      return null
    },

    totalCard() {
      let revenue = 0
      if (this.billingDashboard) {
        for (const d of Array.from(this.billingDashboard)) revenue += d.revenue
      }
      return { title: 'total', revenue }
    },

    initialDateRange() {
      return [
        this.$moment(new Date()).startOf('month').format('YYYY-MM-DD'),
        this.$moment(new Date()).endOf('month').format('YYYY-MM-DD'),
      ]
    },
  },
  beforeMount() {
    if (!this.isJusttoAdmin) this.$router.go(-1)

    this.dateRange[0] = this.initialDateRange[0]
    this.dateRange[1] = this.initialDateRange[1]
    this.clearTransactionsQuery(this.initialDateRange)
    this.setCustomerId(this.$route.params.customerId)
    this.setWorkspaceId(this.workspaceId)
    this.getBillingDashboard()
  },
  methods: {
    ...mapActions([
      'cancelTransaction',
      'clearTransactionsQuery',
      'getBillingDashboard',
      'postTransaction',
      'setCustomerId',
      'setManagementFilters',
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
      const type = evt.eventProps.customProps.type !== 'OTHERS' ? evt.eventProps.customProps.type : 'MANUAL'
      this.setType(type)
    },

    showDisputesAction(evt) {
      const type = evt.eventProps.customProps.type
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('addPrescription', 'BILLING_TRANSACTION')
      this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
      this.$store.commit('updateDisputeQuery', { key: 'startDate', value: this.dateRange[0] })
      this.$store.commit('updateDisputeQuery', { key: 'finishDate', value: this.dateRange[1] })
      this.$store.commit('updateDisputeQuery', { key: 'transactionType', value: type })
      this.$store.commit('setDisputeHasFilters', true)
      this.$store.commit('setDisputesTab', '3')
      this.$router.push('/management')
    },

    addTransactionAction(evt) {
      this.addTransactionForm.value = ''
      this.addTransactionForm.note = ''
      this.addTransactionForm.occurredDate = this.$moment(new Date()).format('YYYY-MM-DD')
      this.addTransactionDialogVisable = true
    },

    addTransaction() {
      this.modalLoading = true
      this.postTransaction(this.addTransactionForm).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Lançamento realizado com sucesso',
        })
      }).finally(() => {
        this.modalLoading = false
        this.addTransactionDialogVisable = false
      })
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
    position: relative;

    .billing-view__back-button {
      position: absolute;
      top: 10px;
      left: 10px;
    }

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

  .el-date-editor.el-input {
    width: 100%;
  }

  .el-card__body {
    height: 100%;
  }
}
</style>
