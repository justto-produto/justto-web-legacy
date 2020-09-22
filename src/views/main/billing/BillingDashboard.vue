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
        v-if="isJusttoAdmin"
        to="/billing"
        class="billing-view__back-button"
      />

      <article class="billing-view__range">
        <h2 class="billing-view__range-title">
          Cobrança do período
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
          de {{ getCurrentCustomer.customerName }}
        </h2>
      </article>

      <jus-grid
        :rows="2"
        :columns="4"
        class="billing-view__cards"
        flow="column"
      >
        <jus-financial-card
          v-for="(card, index) in dataCards"
          :key="index"
          v-grid-item.col-1.row-1
          v-grid-item.col-1.row-2:v-if="index === 6"
          :data="card.data"
          :actions="card.actions"
          @cardAction="handlerAction"
        />
        <jus-financial-card
          v-grid-item.col-1.row-2
          :data="totalCard.data"
          :actions="totalCard.actions"
          highlighted
          @cardAction="handlerAction"
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
            {{ tableSubtitle }}
          </span>
        </div>
        <el-card
          class="billing-view__table-body"
          shadow="never"
        >
          <JusDataTable
            :data="transactionsList"
            :pagination="transactionsPagination"
            :loading="tableLoading"
            loading-text="Aguarde enquanto buscamos seus lançamentos financeiros ..."
            class="billing-view__data-table"
            @floatAction="handlerAction"
            @infiniteHandler="infiniteHandler"
          />
        </el-card>
      </article>

      <el-dialog
        :close-on-click-modal="false"
        :show-close="false"
        :visible.sync="addTransactionDialogVisable"
        :title="addTransactionForm.title"
        width="50%"
      >
        <el-form
          ref="addTransactionForm"
          v-loading="modalLoading"
          :model="addTransactionForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="Valor"
                prop="value"
              >
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
                prop="occurredDate"
              >
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
                prop="note"
              >
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
            @click="addTransactionDialogVisable = false"
          >
            Cancelar
          </el-button>
          <el-button
            :loading="modalLoading"
            type="primary"
            @click.prevent="handlerModalTrigger(addTransactionForm.trigger)"
          >
            Continuar
          </el-button>
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
    JusButtonBack: () => import('@/components/buttons/JusButtonBack')
  },
  data() {
    return {
      dateRange: [],
      searchTerm: '',
      addTransactionDialogVisable: false,
      modalLoading: false,
      addTransactionForm: {
        note: '',
        occurredDate: '',
        title: '',
        trigger: '',
        value: ''
      },
      activeTypeFilter: ''
    }
  },
  computed: {
    ...mapGetters([
      'billingDashboard',
      'getCurrentCustomer',
      'isJusttoAdmin',
      'isAdminProfile',
      'tableLoading',
      'transactions',
      'workspaceId'
    ]),

    filterTransactionsActionParams() {
      return {
        icon: 'eye',
        label: 'Ver lançamentos',
        trigger: 'showTransactions',
        visible: true
      }
    },

    filterDisputesActionParams() {
      return {
        icon: 'management',
        label: 'Visualizar disputas no gerenciamento',
        trigger: 'showDisputes',
        visible: true
      }
    },

    addTransactionActionParams() {
      return {
        icon: 'add',
        label: 'Criar lançamento manual',
        trigger: 'addTransaction',
        visible: this.isJusttoAdmin
      }
    },

    tableSubtitle() {
      if (this.tableLoading) {
        return `Buscando lançamentos para ${this.activeTypeFilter.toUpperCase()}`
      } else if (this.activeTypeFilter) {
        return `Exibindo ${this.transactionsList.length} de ${this.transactions.totalElements || 0} resultados para o filtro ${this.activeTypeFilter.toUpperCase()}`
      } else {
        return 'Selecione um tipo de lançamento para exibir'
      }
    },

    transactionsList() {
      return this.transactions.content ? this.transactions.content : []
    },

    transactionsPagination() {
      const transactionsPagable = JSON.parse(JSON.stringify(this.transactions))
      delete transactionsPagable.content
      return transactionsPagable
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
      } return null
    },

    totalCard() {
      let revenue = 0
      let total = 0
      if (this.billingDashboard) {
        for (const d of Array.from(this.billingDashboard)) {
          revenue += d.revenue
          total += d.total
        }
      }
      return {
        data: {
          type: '',
          title: 'total',
          revenue,
          total
        },
        actions: [this.filterTransactionsActionParams]
      }
    },

    initialDateRange() {
      return [
        this.$moment(new Date()).startOf('month').format('YYYY-MM-DD'),
        this.$moment(new Date()).endOf('month').format('YYYY-MM-DD')
      ]
    }
  },
  watch: {
    workspaceId(current, _old, next) {
      if (current !== next) this.$router.push('/billing')
    }
  },
  created() {
    this.dateRange[0] = this.initialDateRange[0]
    this.dateRange[1] = this.initialDateRange[1]
    this.clearTransactionsQuery(this.initialDateRange)
    this.setCustomerId(this.$route.params.customerId)
    this.setWorkspaceId(this.workspaceId)
    this.getBillingDashboard()

    if (!this.isJusttoAdmin && !this.isAdminProfile) {
      this.$router.go(-1)
      this.$jusNotification({
        title: 'Ops!',
        message: 'Você não pode entra ai. Fale com um administrador',
        type: 'warning'
      })
    }
  },
  methods: {
    ...mapActions([
      'cancelTransaction',
      'clearTransactionsQuery',
      'patchTransaction',
      'getBillingDashboard',
      'getTransactions',
      'postTransaction',
      'setCustomerId',
      'setManagementFilters',
      'setRangeDate',
      'setTerm',
      'setType',
      'setWorkspaceId'
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
      this.activeTypeFilter = this.activeTypeFilter ? this.activeTypeFilter : 'TOTAL'
    },

    handlerAction(evt) {
      const action = evt.eventProps.trigger + 'Action'
      this[action](evt)
    },

    showTransactionsAction(evt) {
      const type = evt.eventProps.customProps.type !== 'OTHERS' ? evt.eventProps.customProps.type : 'MANUAL'
      this.activeTypeFilter = evt.eventProps.customProps.title
      this.setType(type)
    },

    showDisputesAction(evt) {
      const type = evt.eventProps.customProps.type

      const managementRoute = this.$router.resolve({
        name: 'management',
        query: {
          status: [],
          startDate: this.dateRange[0],
          finishDate: this.dateRange[1],
          transactionType: type,
          prescription: 'BILLING_TRANSACTION',
          disputeHasFilters: true,
          disputeTab: 3
        }
      })
      window.open(managementRoute.href, '_blank')
    },

    handlerModalTrigger(trigger) {
      this[trigger]()
    },

    addTransactionAction(evt) {
      this.addTransactionForm.note = ''
      this.addTransactionForm.occurredDate = this.$moment(new Date()).format('YYYY-MM-DD')
      this.addTransactionForm.title = 'Adicionar Lançamento'
      this.addTransactionForm.trigger = evt.eventProps.trigger
      this.addTransactionForm.value = ''

      this.addTransactionDialogVisable = true
    },

    addTransaction() {
      this.modalLoading = true

      const transaction = this.addTransactionForm
      delete transaction.title
      delete transaction.trigger

      this.postTransaction(transaction).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Lançamento realizado com sucesso'
        })
      }).finally(() => {
        this.modalLoading = false
        this.addTransactionDialogVisable = false
      })
    },

    editTransactionAction(evt) {
      const {
        customProps: {
          id,
          note,
          occurredDate,
          value
        },
        trigger
      } = evt.eventProps

      this.addTransactionForm = {
        id,
        note,
        occurredDate,
        title: 'Editar lançamento',
        trigger,
        value
      }

      this.addTransactionDialogVisable = true
    },

    editTransaction() {
      this.modalLoading = true

      const transaction = this.addTransactionForm
      delete transaction.title
      delete transaction.trigger

      this.patchTransaction(transaction).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Lançamento editado com sucesso'
        })
      }).finally(() => {
        this.modalLoading = false
        this.addTransactionDialogVisable = false
      })
    },

    cancelTransactionAction(evt) {
      this.$prompt('Insira o motivo do cancelamento', 'Cancelar lançamento', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then(({ value }) => {
        this[evt.eventProps.trigger]({
          id: evt.eventProps.customProps.id,
          data: { reason: value }
        }).then(() => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Lançamento cancelado com sucesso'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        })
      })
    },

    infiniteHandler($state) {
      this.getTransactions('isInfinit').then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.billing-view {
  overflow: auto;

  .billing-view__slot-main {
    height: 100%;
    display: grid;
    grid-template-rows: repeat(2, auto) minmax(400px, 1fr);
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
      padding-top: 8px;
      display: grid;
      gap: 8px;
      grid-template-rows: auto 1fr;

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
        margin: 0 4px !important;
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
