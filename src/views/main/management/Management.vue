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
          <h2 class="el-notification__title">Há atualizações nas<br>disputas</h2>
          <div class="el-notification__content">
            <a href="#" @click.prevent="getDisputes">Clique aqui para recarregar</a>
          </div>
          <div class="el-notification__closeBtn el-icon-close" @click="$store.commit('disputeSetHasNew', false)" />
        </div>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="exportDisputesDialog"
        :show-close="false"
        append-to-body
        class="view-management__export-dialog"
        title="Exportar disputas"
        width="50%">
        <p>Selecione e ordene as colunas desejadas para exportação:</p>
        <div class="view-management__export-dialog-options">
          <el-checkbox :indeterminate="isIndeterminate" v-model="isSelectedAllColumns" @change="invertSelectionColumns">Nome do campo ({{ checkedNodes }} de {{ columns.length }})</el-checkbox>
          <el-input v-model="filterQuery" size="small" placeholder="Buscar" prefix-icon="el-icon-search" clearable />
        </div>
        <el-tree
          ref="tree"
          :data="columns"
          :allow-drop="allowDrop"
          :filter-node-method="filterColumns"
          node-key="key"
          draggable
          show-checkbox
          @check="handlerChangeTree"
          @node-drag-end="nodeDragEnd">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ $t(node.label) | capitalize }}</span>
            <jus-icon class="drag-icon" icon="menu-hamburger"/>
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
import waitForConnection from '@/utils/loading'

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
      loadingExport: false,
      filtersVisible: false,
      termDebounce: '',
      disputeDebounce: '',
      selectedIds: [],
      importDialogVisible: false,
      exportDisputesDialog: false,
      isSelectedAllColumns: true,
      isIndeterminate: false,
      checkedNodes: 0,
      filterQuery: '',
      filteredNodes: {},
      columns: []
    }
  },
  computed: {
    loadingDisputes () {
      return this.$store.getters.loadingDisputes
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
      set (tab) { this.$store.commit('setDisputesTab', tab) }
    },
    multiActive () {
      return this.selectedIds.length >= 1
    },
    disputesTotalLength () {
      return this.$store.getters.disputeQuery.total
    },
    persons () {
      return this.$store.state.disputeModule.query.persons
    },
    term: {
      get () {
        return this.$store.getters.disputeQueryTerm
      },
      set (term) {
        this.$store.commit('updateDisputeQuery', { key: 'term', value: term })
      }
    }
  },
  watch: {
    term (term) {
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.$jusSegment('Busca de disputas na tabela do gerenciamento', { description: `Termo utilizado: ${term}` })
        this.getDisputes()
      }, 800)
    },
    persons () {
      this.getDisputes()
    },
    filterQuery (val) {
      this.$refs.tree.filter(val)
    }
  },
  beforeCreate () {
    this.$store.dispatch('getNotVisualizeds')
    this.$store.dispatch('getNearExpirations')
  },
  created () {
    this.getDisputes()
  },
  mounted () {
    this.$store.dispatch('getExportColumns').then(response => {
      Object.keys(response).forEach(key => {
        this.columns.push({
          'key': key,
          'label': response[key]
        })
      })
    }).finally(() => {
      this.filteredNodes = this.columns
      this.checkedNodes = this.columns.length
    })
  },
  methods: {
    filterColumns (value, data) {
      this.filteredNodes = this.columns.filter(c => {
        return this.$t(c.key).toLowerCase().includes(value.toLowerCase())
      })
      this.handlerChangeTree('', { checkedKeys: this.$refs.tree.getCheckedKeys() })
      if (!value) return true
      return this.$t(data.key).toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    handlerChangeTree (value, obj) {
      setTimeout(function () {
        let checkedNodes = this.filteredNodes.filter(n => obj.checkedKeys.includes(n.key)).length
        let nodesLength = this.filteredNodes.length
        this.isSelectedAllColumns = checkedNodes === nodesLength
        this.isIndeterminate = checkedNodes > 0 && checkedNodes < nodesLength
        this.checkedNodes = obj.checkedKeys.length
      }.bind(this), 200)
    },
    invertSelectionColumns (value) {
      if (value) {
        let allNodesSelected = [...this.$refs.tree.getCheckedKeys(), ...this.filteredNodes.map(c => c.key)]
        this.$refs.tree.setCheckedKeys(allNodesSelected)
      } else {
        let filteredKeys = this.columns.filter(c => !this.filteredNodes.includes(c))
        this.$refs.tree.setCheckedKeys(filteredKeys.map(c => c.key))
      }
      this.isIndeterminate = false
      this.handlerChangeTree('', { checkedKeys: this.$refs.tree.getCheckedKeys() })
    },
    nodeDragEnd (draggingNode, dropNode, dropType, ev) {
      setTimeout(() => {
        this.$refs.tree.setChecked(draggingNode.data.key, draggingNode.checked)
      }, 100)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (type === 'prev') {
        return true
      }
      return false
    },
    getDisputes () {
      clearTimeout(this.disputeDebounce)
      this.disputeDebounce = setTimeout(() => {
        return this.$store.dispatch('getDisputes', 'resetPages').catch(error => {
          console.error(error)
          if (this.$store.getters.isLoggedIn) {
            this.$jusNotification({ type: 'error' })
          }
        }).finally(() => {
          this.$nextTick(() => {
            let main = this.$el.querySelector('.el-table__body-wrapper')
            if (main) {
              main.scrollTop = 0
            }
          })
          if (this.$refs.managementTable) this.$refs.managementTable.disputeKey += 1
        })
      }, 300)
    },
    clearSelection () {
      this.$refs.managementTable.clearSelection()
    },
    handleChangeTab (tab) {
      this.$refs.managementTable.showEmpty = false
      this.$store.commit('clearDisputes')
      this.$store.commit('clearDisputeQueryByTab')
      this.$store.commit('setDisputeHasFilters', false)
      // SEGMENT TRACK
      this.$jusSegment(`Navegação na aba ${this.$t('tab.' + tab).toUpperCase()}`)
      switch (tab) {
        case '0':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['ENGAGEMENT'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['expirationDate,asc'] })
          break
        case '1':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['RUNNING'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'expirationDate,asc'] })
          break
        case '2':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'conclusionDate,asc'] })
          break
        default:
          this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['id,desc'] })
      }
      this.getDisputes()
    },
    showExportDisputesDialog () {
      if (waitForConnection()) {
        this.exportDisputesDialog = true
        const jusexportcolumns = JSON.parse(localStorage.getItem('jusexportcolumns'))
        setTimeout(() => {
          if (jusexportcolumns) {
            this.$refs.tree.setCheckedKeys(jusexportcolumns)
          } else {
            this.$refs.tree.setCheckedKeys(this.columns.map(c => c.key))
          }
          this.handlerChangeTree('', { checkedKeys: this.$refs.tree.getCheckedKeys() })
        }, 200)
      }

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
      .drag-icon {
        z-index: -99;
        width: 18px;
        float: right;
        margin-right: 20px;
        cursor: grab;
      }
    }
    &-options {
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-input {
        width: 200px;
        margin-right: 10px;
      }
      .el-checkbox {
        margin-left: 24px;
        font-weight: 500;
        &__label {
          color: #343c4b !important;
        }
      }
    }
  }
}
</style>
