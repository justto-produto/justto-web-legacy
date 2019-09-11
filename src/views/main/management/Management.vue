<template>
  <jus-view-main class="view-management" :loading-main="loadingDisputes">
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
          <el-input prefix-icon="el-icon-search" />
          <el-button plain @click="filtersVisible = true">
            <jus-icon :is-white="false" icon="filter" />
            Filtros
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
      initialDisputesPerPage: this.$store.getters.disputesInitialSize
    }
  },
  computed: {
    engagementLength () {},
    interactionLength () {},
    newDealsLength () {},
    disputes () {
      return this.$store.getters.disputes
    },
    activeTab: {
      get () { return this.$store.getters.disputeTab},
      set (tab) {
        this.$store.commit('setDisputesTab', tab)
      }
    },
    disputesTotalLength () {
      return this.$store.getters.disputesTotal
    },
    disputesPerPage: {
      get () {
        return this.$store.getters.disputesSize
      },
      set (size) {
        this.$store.commit('setDisputesSize', size)
        this.getDisputes()
      }
    },
    currentPage: {
      get () {
        return this.$store.getters.disputesPage
      },
      set (size) {
        this.$store.commit('setDisputesPage', size)
        this.getDisputes()
      }
    }
  },
  methods: {
    getDisputes () {
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
    },
    handleChangeTab (tab) {
      switch (tab) {
        case '0':
          this.$store.commit('setDisputesFilters', { status: ['ENGAGEMENT'] })
          break;
        case '1':
          this.$store.commit('setDisputesFilters', { status: ['RUNNING'] })
          break;
        case '2':
          this.$store.commit('setDisputesFilters', { status: ['ACCEPTED', 'CHECKOUT'] })
          break;
        default:
        this.$store.commit('removeDisputesFilter', 'status')
      }
      this.getDisputes()
    },
    exportDisputes () {}
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
