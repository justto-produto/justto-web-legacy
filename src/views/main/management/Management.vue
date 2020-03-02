<template>
  <jus-view-main :loading-main="loadingDisputes" class="view-management">
    <template slot="main">
      <management-actions
        :active="multiActive"
        :selected-ids.sync="selectedIds"
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
          <el-tooltip content="Importar disputas">
            <el-button
              plain
              @click="showImportDialog">
              <jus-icon icon="upload-file" style="width: 20px;" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Exportar disputas">
            <el-button
              :disabled="disputes.length === 0"
              plain
              icon="el-icon-download"
              data-testid="export-disputes"
              @click="showExportDisputesDialog" />
          </el-tooltip>
          <jus-import-dialog :dialog-visible.sync="importDialogVisible" />
        </div>
      </div>
      <management-filters
        :visible.sync="filtersVisible"
        :tab-index="activeTab" />
      <div style="min-height: 44px;position: relative;">
        <management-prescriptions v-show="activeTab !== '2'" :active-tab="activeTab" @management:getDisputes="getDisputes" />
        <div v-show="disputesTotalLength" style="right: 0px;position: absolute;top: 13px;">
          Exibindo {{ disputes.length }} de {{ disputesTotalLength }} disputa<span v-show="disputesTotalLength > 1">s</span>
        </div>
      </div>
      <management-table
        ref="managementTable"
        :active-tab.sync="activeTab"
        :selected-ids.sync="selectedIds"
        :loading-disputes.sync="loadingDisputes"
        @getDisputes="getDisputes" />
      <div v-show="hasNew" class="el-notification info right" style="bottom: 100px;z-index: 1980;">
        <i class="el-notification__icon el-icon-info" />
        <div class="el-notification__group is-with-icon">
          <h2 class="el-notification__title">Há atualizações nas disputas</h2>
          <div class="el-notification__content">
            <a href="#" @click.prevent="getDisputes">Clique aqui para recarregar</a>
          </div>
        </div>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="exportDisputesDialog"
        append-to-body
        class="view-management__export-dialog"
        title="Exportar disputas"
        width="50%">
        <p>Selecione e ordene as colunas desejadas para exportação:</p>
        <div class="view-management__export-dialog-options">
          <el-input v-model="columnsFilter" size="small" placeholder="Buscar" prefix-icon="el-icon-search" clearable />
          <!-- <el-button size="small" @click="invertSelectionColumns">{{ selectedColumnsLenght < filteredColumns.length ? 'Selecionar tudo' : 'Deselecionar tudo' }}</el-button>
          <span>{{ selectedColumnsLenght }} Colunas selecionadas</span> -->
        </div>
        <el-tree
          ref="tree"
          :data="filteredColumns"
          :allow-drop="allowDrop"
          node-key="label"
          draggable
          show-checkbox
          @node-drag-end="nodeDragEnd">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ $t(node.label) | capitalize }}</span>
            <i class="el-icon-rank" />
          </span>
        </el-tree>
        <span slot="footer">
          <el-button :disabled="loadingExport" plain @click="exportDisputesDialog = false">Cancelar</el-button>
          <el-button :loading="loadingExport" type="primary" @click.prevent="exportDisputes">
            Exportar
          </el-button>
        </span>
      </el-dialog>
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Management',
  components: {
    ManagementFilters: () => import('./partials/ManagementFilters'),
    ManagementTable: () => import('./partials/ManagementTable'),
    ManagementActions: () => import('./partials/ManagementActions'),
    ManagementPrescriptions: () => import('./partials/ManagementPrescriptions'),
    JusImportDialog: () => import('@/components/dialogs/JusImportDialog')
  },
  data () {
    return {
      loadingDisputes: false,
      loadingExport: false,
      filtersVisible: false,
      term: '',
      columnsFilter: '',
      termDebounce: '',
      disputeDebounce: '',
      selectedIds: [],
      importDialogVisible: false,
      exportDisputesDialog: false,
      columns: [
        { label: 'DISPUTE_CODE' },
        { label: 'CAMPAIGN' },
        { label: 'STRATEGY' },
        { label: 'CLASSIFICATION' },
        { label: 'CLASSIFICATION_DETAIL' },
        { label: 'DISPUTE_ORG' },
        { label: 'EXPIRATION_DATE' },
        { label: 'DESCRIPTION' },
        { label: 'PAUSED' },
        { label: 'FAVORITE' },
        { label: 'VISUALIZED' },
        { label: 'STATUS' },
        { label: 'FIRST_INTERACTION_DATE' },
        { label: 'LAST_INTERACTION_DATE' },
        { label: 'LAST_SEND_MESSAGE' },
        { label: 'LAST_RECEIVED_MESSAGE' },
        { label: 'LAST_NOTE' },
        { label: 'UPPER_RANGE' },
        { label: 'REQUESTED_VALUE' },
        { label: 'PROPOSAL_VALUE' },
        { label: 'COUNTER_PROPOSAL_VALUE' },
        { label: 'OWNER_PROPOSAL' },
        { label: 'OWNER_COUNTER_PROPOSAL' },
        { label: 'HAS_DOCUMENT' },
        { label: 'SIGNED_DOCUMENT_STATUS' },
        { label: 'LAST_NEGOTIATOR_ACCESS_DATE' },
        { label: 'IMPORT_DATE' },
        { label: 'CONCLUSION_DESCRIPTION' },
        { label: 'CONCLUSION_DATE' },
        { label: 'CONCLUSION_REASONS' },
        { label: 'LAST_OFFER_VALUE' },
        { label: 'PARTY_NAMES' },
        { label: 'PARTY_DOCUMENTS' },
        { label: 'LAWYER_PARTY_NAMES' },
        { label: 'LAWYER_PARTY_DOCUMENTS' },
        { label: 'RESPONDENT_NAMES' },
        { label: 'NEGOTIATOR_NAMES' }
      ]
    }
  },
  computed: {
    // selectedColumnsLenght () {
    //   let selectedCols = this.$refs.tree.getCheckedKeys()
    //   return selectedCols.length
    // },
    filteredColumns () {
      return this.columns.filter(c => {
        return this.$t(c.label).toLowerCase().includes(this.columnsFilter.toLowerCase())
      })
    },
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
    persons () {
      return this.$store.state.disputeModule.query.persons
    }
  },
  watch: {
    term (term) {
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.$jusSegment('Busca de disputas na tabela do gerenciamento', { description: `Termo utilizado: ${term}` })
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
  created () {
    this.getDisputes()
  },
  methods: {
    // invertSelectionColumns () {
    //   if (this.selectedColumnsLenght < this.filteredColumns.length) {
    //     this.$refs.tree.setCheckedKeys(this.columns.map(c => c.label))
    //   } else {
    //     this.$refs.tree.setCheckedKeys([])
    //   }
    // },
    nodeDragEnd (draggingNode, dropNode, dropType, ev) {
      setTimeout(() => {
        this.$refs.tree.setChecked(draggingNode.data.label, draggingNode.checked)
      }, 100)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (type === 'prev') {
        return true
      }
      return false
    },
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
      // SEGMENT TRACK
      this.$jusSegment(`Navegação na aba ${this.$t('tab.' + tab).toUpperCase()}`)
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
    showExportDisputesDialog () {
      this.exportDisputesDialog = true
      const jusexportcolumns = JSON.parse(localStorage.getItem('jusexportcolumns'))
      setTimeout(() => {
        if (jusexportcolumns) {
          this.$refs.tree.setCheckedKeys(jusexportcolumns)
        } else {
          this.$refs.tree.setCheckedKeys(this.columns.map(c => c.label))
        }
      }, 200)
    },
    exportDisputes () {
      this.loadingExport = true
      this.$store.dispatch('exportDisputes', this.$refs.tree.getCheckedKeys())
        .then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Exportar disputas')
          localStorage.setItem('jusexportcolumns', JSON.stringify(this.$refs.tree.getCheckedKeys()))
        })
        .catch(error => {
          console.error(error)
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
          this.exportDisputesDialog = false
        })
    },
    showImportDialog () {
      // SEGMENT TRACK
      this.$jusSegment('Botão importação rápida')
      this.importDialogVisible = true
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
  &__buttons {
    .el-input + button {
      margin-left: 10px;
    }
    .el-input {
      width: 180px;
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
  &__export-dialog {
    .custom-tree-node {
      width: 100%;
      i {
        float: right;
        margin-top: 2px;
        margin-right: 20px;
      }
    }
    &-options {
      margin-bottom: 10px;
      .el-input {
        width: 220px;
        margin-right: 10px;
      }
      > span {
        margin-top: 8px;
        float: right;

      }
    }
  }
}
</style>
