<template>
  <jus-view-main :loading-main="loadingDisputes" class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
    </template>
    <template slot="main">
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
                class="el-badge--absolute" />
            </span>
          </el-tab-pane>
          <el-tab-pane name="2" label="Com Interação">
            <span slot="label">
              Proposta aceita
              <el-badge
                :hidden="!newDealsLength"
                :value="newDealsLength"
                :max="99"
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
      <management-table :disputes="disputes" />
      <el-pagination
        :total.sync="disputesTotalLength"
        :page-size.sync="disputesPerPage"
        :current-page.sync="currentPage"
        :pager-count="15"
        :page-sizes="[initialDisputesPerPage, 30, 50, 100]"
        layout="total, prev, pager, next, sizes" />
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Management',
  components: {
    ManagementFilters: () => import('./partials/ManagementFilters'),
    ManagementTable: () => import('./partials/ManagementTable')
  },
  data () {
    return {
      loadingDisputes: false,
      loadingExport: false,
      filtersVisible: false,
      term: '',
      termDebounce: '',
      disputeDebounce: ''
    }
  },
  watch: {
    term (term) {
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.$store.commit('updateDisputeQuery', { key: 'term', value: term })
        this.getDisputes()
      }, 800)
    }
  },
  computed: {
    hasFilters () {
      return this.$store.getters.disputeHasFilters
    },
    engagementLength () {
      return this.$store.getters.disputeNotVisualizedEngajement
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
    activeTab: {
      get () { return this.$store.getters.disputeTab },
      set (tab) {
        this.$store.commit('setDisputesTab', tab)
      }
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
    }
  },
  beforeCreate () {
    this.$store.watch(state => state.disputeModule.query.persons, persons => {
      this.getDisputes()
    })
    this.$store.dispatch('getNotVisualizeds')
    this.$store.dispatch('getNearExpirations')
  },
  methods: {
    getDisputes () {
      clearTimeout(this.disputeDebounce)
      this.disputeDebounce = setTimeout(() => {
        this.loadingDisputes = true
        return this.$store.dispatch('getDisputes').finally(() => {
          this.loadingDisputes = false
          this.$nextTick(() => {
            let main = this.$el.querySelector('.el-table__body-wrapper')
            if (main) {
              main.scrollTop = 0
            }
          })
        })
      }, 300)
    },
    handleChangeTab (tab) {
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('setDisputeHasFilters', false)
      switch (tab) {
        case '0':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['ENGAGEMENT'] })
          break
        case '1':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['RUNNING'] })
          break
        case '2':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
          break
        default:
          this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
      }
      this.getDisputes()
    },
    exportDisputes () {
      this.loadingExport = true
      this.$store.dispatch('exportDisputes', this.disputes.map(d => d.id)).then(response => {
        // eslint-disable-next-line
        // window.open('/api/export/' + response)
        window.analytics.track('Planilha de "' + this.activeTabLabel + '" exportada')
      }).finally(() => {
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
  }
  .el-pagination {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
