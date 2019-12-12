<template>
  <jus-view-main :loading-main="loadingDisputes" class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
    </template>
    <template slot="main">
      <management-actions
        :active="multiActive"
        :selected-ids="selectedIds"
        @disputes:clear="clearSelection"/>
      <div class="view-management__filters">
        <el-tabs
          ref="disputeTabs"
          :before-leave="handleChangeTab"
          v-model="activeTab"
          class="view-management__tabs">
          <el-tab-pane name="0">
            <span slot="label">
              Sem resposta
              <el-badge
                :hidden="!engagementLength"
                :value="engagementLength"
                :max="99"
                data-testid="badge-tab0"
                type="primary"
                class="el-badge--absolute" />
            </span>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label">
              Em negociação
              <el-badge
                :hidden="!interactionLength"
                :value="interactionLength"
                :max="99"
                data-testid="badge-tab1"
                type="primary"
                class="el-badge--absolute" />
            </span>
          </el-tab-pane>
          <el-tab-pane name="2" label="Com Interação" data-testid="tab-pproposal-accepted">
            <span slot="label">
              Proposta aceita
              <el-badge
                :hidden="!newDealsLength"
                :value="newDealsLength"
                :max="99"
                data-testid="badge-tab2"
                type="primary"
                class="el-badge--absolute" />
            </span>
          </el-tab-pane>
          <el-tab-pane name="3" label="Com Interação">
            <span slot="label">Todos</span>
          </el-tab-pane>
        </el-tabs>
        <div class="view-management__buttons">
          <el-input v-model="term" clearable prefix-icon="el-icon-search" />
          <el-button
            :plain="!hasFilters"
            :type="hasFilters ? 'primary' : ''"
            @click="filtersVisible = true">
            <jus-icon :is-white="hasFilters" icon="filter" data-testid="management-filterbtn" />
            Filtrar
          </el-button>
          <el-button
            :loading="loadingExport"
            :disabled="disputes.length === 0"
            plain
            icon="el-icon-download"
            data-testid="export-disputes"
            @click="exportDisputes">
            Exportar
          </el-button>
        </div>
      </div>
      <management-filters
        :visible.sync="filtersVisible"
        :tab-index="activeTab" />
      <management-table
        ref="managementTable"
        :active-tab.sync="activeTab"
        :selected-ids.sync="selectedIds"
        :loading-disputes.sync="loadingDisputes" />
      <el-pagination
        :total.sync="disputesTotalLength"
        :page-size.sync="disputesPerPage"
        :current-page.sync="currentPage"
        :pager-count="15"
        :page-sizes="[initialDisputesPerPage, 30, 50, 100]"
        data-testid="pagination"
        layout="total, prev, pager, next, sizes" />
      <div v-show="hasNew" class="el-notification info right" style="bottom: 100px;z-index: 1980;">
        <i class="el-notification__icon el-icon-info" />
        <div class="el-notification__group is-with-icon">
          <h2 class="el-notification__title">Há atualizações nas disputas</h2>
          <div class="el-notification__content">
            <a href="#" @click.prevent="getDisputes">Clique aqui para recarregar</a>
          </div>
          <!-- <div class="el-notification__closeBtn el-icon-close" /> -->
        </div>
      </div>
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Management',
  components: {
    ManagementFilters: () => import('./partials/ManagementFilters'),
    ManagementTable: () => import('./partials/ManagementTable'),
    ManagementActions: () => import('./partials/ManagementActions')
  },
  data () {
    return {
      loadingDisputes: false,
      loadingExport: false,
      filtersVisible: false,
      term: '',
      termDebounce: '',
      disputeDebounce: '',
      selectedIds: []
    }
  },
  computed: {
    hasFilters () {
      return this.$store.getters.disputeHasFilters
    },
    engagementLength () {
      return this.$store.getters.disputeNearExpirationsEngajement
    },
    interactionLength () {
      return this.$store.getters.disputeNotVisualizedInteration
    },
    newDealsLength () {
      return this.$store.getters.disputeNotVisualizedNewDeal
    },
    disputes () {
      return this.$store.getters.disputes
    },
    hasNew () {
      return this.$store.getters.disputeHasNew
    },
    activeTab: {
      get () { return this.$store.getters.disputeTab },
      set (tab) {
        this.$store.commit('setDisputesTab', tab)
      }
    },
    multiActive () {
      return this.selectedIds.length >= 1
    },
    disputesTotalLength () {
      return this.$store.getters.disputeQuery.total
    },
    initialDisputesPerPage () {
      return this.$store.getters.disputeQuery.initialSize
    },
    disputesPerPage: {
      get () {
        return this.$store.getters.disputeQuery.size
      },
      set (size) {
        this.$store.commit('updateDisputeQuery', { key: 'page', value: 1 })
        this.$store.commit('updateDisputeQuery', { key: 'size', value: size })
        this.getDisputes()
      }
    },
    currentPage: {
      get () {
        return this.$store.getters.disputeQuery.page
      },
      set (page) {
        this.$store.commit('updateDisputeQuery', { key: 'page', value: page })
        this.getDisputes()
      }
    },
    persons () {
      return this.$store.state.disputeModule.query.persons
    }
  },
  watch: {
    term (term) {
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.$store.commit('updateDisputeQuery', { key: 'term', value: term })
        this.getDisputes()
      }, 800)
    },
    persons () {
      this.getDisputes()
    }
  },
  beforeCreate () {
    this.$store.dispatch('getNotVisualizeds')
    this.$store.dispatch('getNearExpirations')
  },
  methods: {
    getDisputes () {
      this.loadingDisputes = true
      clearTimeout(this.disputeDebounce)
      this.disputeDebounce = setTimeout(() => {
        return this.$store.dispatch('getDisputes').catch(error => {
          console.error(error)
          if (this.$store.getters.isLoggedIn) {
            this.$jusNotification({ type: 'error' })
          }
        }).finally(() => {
          this.loadingDisputes = false
          this.$nextTick(() => {
            let main = this.$el.querySelector('.el-table__body-wrapper')
            if (main) {
              main.scrollTop = 0
            }
            if (this.$refs.managementTable) this.$refs.managementTable.doLayout()
          })
        })
      }, 300)
    },
    clearSelection () {
      this.$refs.managementTable.clearSelection()
    },
    handleChangeTab (tab) {
      this.$store.commit('clearDisputes')
      this.$store.commit('clearDisputeQueryByTab')
      this.$store.commit('setDisputeHasFilters', false)
      switch (tab) {
        case '0':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['ENGAGEMENT'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['expirationDate,asc', 'favorite,desc'] })
          break
        case '1':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['RUNNING'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'favorite,desc'] })
          break
        case '2':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'favorite,desc'] })
          break
        default:
          this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['id,desc', 'favorite,desc'] })
      }
      this.getDisputes()
    },
    exportDisputes () {
      this.loadingExport = true
      this.$store.dispatch('exportDisputes', this.disputes.map(d => d.id))
        .catch(error => {
          if (error.response && error.response.status === 403) {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Tamanho da planilha é maior do que o suportado. Para exportar planilhas com mais de 500 disputas, entre em contato com o administrador do sistema.',
              type: 'warning',
              duration: 0
            })
          } else {
            this.$jusNotification({ type: 'error' })
          }
        })
        .finally(() => {
          this.loadingExport = false
        })
    }
  }
}
</script>

<style lang="scss">
.view-management {
  &__filters {
    display: flex;
    justify-content: space-between;
  }
  &__tabs {

  }
  &__buttons {
    .el-input + button {
      margin-left: 10px;
    }
    .el-input {
      width: 200px;
      vertical-align: middle;
    }
    img {
      margin: -3px 0px;
      width: 14px;
    }
  }
  .jus-main-view__main-card .el-card__body {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }
  .el-pagination {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
