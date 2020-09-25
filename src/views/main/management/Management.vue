<template>
  <jus-view-main
    :loading-main="loadingDisputes"
    class="view-management"
  >
    <template slot="main">
      <management-actions
        :active="multiActive"
        :active-tab="activeTab"
        :selected-ids.sync="selectedIds"
        @disputes:clear="clearSelection"
      />
      <div class="view-management__filters">
        <el-tabs
          ref="disputeTabs"
          v-model="activeTab"
          :before-leave="handleChangeTab"
          class="view-management__tabs"
        >
          <el-tab-pane
            v-if="isJusttoAdmin || workspaceProperties.PRE_NEGOTIATION"
            name="-1"
          >
            <span slot="label">
              Pré-Negociação
              <!-- <el-badge
                :hidden="!disputes.length"
                :value="disputes.length"
                :max="99"
                data-testid="badge-tab-1"
                type="primary"
                class="el-badge--absolute"
              /> -->
            </span>
          </el-tab-pane>
          <el-tab-pane name="0">
            <span slot="label">
              Sem resposta
              <el-badge
                :hidden="!engagementLength"
                :value="engagementLength"
                :max="99"
                data-testid="badge-tab0"
                type="primary"
                class="el-badge--absolute"
              />
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
                class="el-badge--absolute"
              />
            </span>
          </el-tab-pane>
          <el-tab-pane
            name="2"
            label="Com Interação"
            data-testid="tab-pproposal-accepted"
          >
            <span slot="label">
              Proposta aceita
              <el-badge
                :hidden="!newDealsLength"
                :value="newDealsLength"
                :max="99"
                data-testid="badge-tab2"
                type="primary"
                class="el-badge--absolute"
              />
            </span>
          </el-tab-pane>
          <el-tab-pane
            name="3"
            label="Com Interação"
          >
            <span slot="label">Todos</span>
          </el-tab-pane>
        </el-tabs>
        <div class="view-management__buttons">
          <!-- <el-input
            v-model="term"
            clearable
            prefix-icon="el-icon-search"
          /> -->
          <JusFilterButton @getDisputes="getDisputes" />
          <el-select
            v-model="ufFilterValue"
            :filter-method="ufSearch"
            multiple
            filterable
            collapse-tags
            placeholder="UF"
            class="view-management__buttons-select"
            @change="setUfFilter"
          >
            <el-option
              v-for="state in filteredBrazilianStates"
              :key="state.value"
              :label="state.value"
              :value="state.value"
            >
              <span>{{ state.name }}</span>
              <span class="view-management__select-options">{{ state.value }}</span>
            </el-option>
          </el-select>
          <el-tooltip content="Filtrar disputas">
            <el-button
              :plain="!hasFilters"
              :type="hasFilters ? 'primary' : ''"
              @click="filtersVisible = true"
            >
              <jus-icon
                :is-white="hasFilters"
                icon="filter"
                data-testid="management-filterbtn"
              />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Importar disputas">
            <el-button
              plain
              @click="showImportDialog"
            >
              <jus-icon
                icon="upload-file"
                style="width: 16px;"
              />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Exportar">
            <el-button
              :disabled="disputes.length === 0"
              plain
              icon="el-icon-download"
              data-testid="export-disputes"
              @click="showExportDisputesDialog"
            />
          </el-tooltip>
          <jus-import-dialog :dialog-visible.sync="importDialogVisible" />
        </div>
      </div>
      <management-filters
        :visible.sync="filtersVisible"
        :tab-index="activeTab"
      />
      <div style="min-height: 44px;position: relative;">
        <management-prescriptions
          :active-tab="activeTab"
          @management:getDisputes="getDisputes"
        />
        <div
          v-show="disputesTotalLength"
          style="right: 0px;position: absolute;top: 13px;"
        >
          Exibindo {{ disputes.length }} de {{ disputesTotalLength }} disputa<span v-show="disputesTotalLength > 1">s</span>
        </div>
      </div>
      <management-table
        ref="managementTable"
        :active-tab.sync="activeTab"
        :selected-ids.sync="selectedIds"
        :loading-disputes.sync="loadingDisputes"
        @getDisputes="getDisputes"
      />
      <div
        v-show="hasNew"
        class="el-notification info right"
        style="bottom: 100px;z-index: 1980;"
      >
        <i class="el-notification__icon el-icon-info" />
        <div class="el-notification__group is-with-icon">
          <h2 class="el-notification__title">
            Há atualizações nas<br>disputas
          </h2>
          <div class="el-notification__content">
            <a
              href="#"
              @click.prevent="getDisputes"
            >Clique aqui para recarregar</a>
          </div>
          <div
            class="el-notification__closeBtn el-icon-close"
            @click="$store.commit('disputeSetHasNew', false)"
          />
        </div>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="exportDisputesDialog"
        :show-close="false"
        append-to-body
        class="view-management__export-dialog"
        title="Exportação"
        width="50%"
      >
        <div class="view-management__export-dialog-titles">
          <span class="view-management__export-dialog-title">Historico de exportações</span>
          <p class="view-management__export-dialog-subtitle">
            Acompanhe o andamento de suas solicitações:
          </p>
        </div>
        <el-card
          shadow="never"
          class="view-management__export-dialog-card"
        >
          <el-table
            :data="exportHistory.content"
            :row-class-name="exportHistoryRowClass"
            height="150"
            empty-text="Você ainda não realizou exportações..."
          >
            <el-table-column
              label="Situação"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-tooltip
                  :disabled="!exportSituation(scope.row) === 'QUEUE'"
                  :content="buildSituationTooltip(scope.row)"
                >
                  <span>
                    <i
                      v-if="scope.row.error"
                      class="el-icon-warning"
                    />
                    {{ $t(`dispute.export.${exportSituation(scope.row)}`).toUpperCase() }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="Requisição"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <span>{{ exportDateTime(scope.row.requestedAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Conclusão"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <jus-icon
                  v-if="exportSituation(scope.row) === 'QUEUE'"
                  icon="clock"
                />
                <JusLoader
                  v-if="exportSituation(scope.row) === 'PROCESSING'"
                  color="warning"
                />
                <span v-if="['FINISHED', 'FAILED'].includes(exportSituation(scope.row))">
                  {{ exportDateTime(scope.row.exportFinishedAt) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              width="40"
              align="center"
            >
              <template slot-scope="scope">
                <el-tooltip
                  v-if="exportSituation(scope.row) === 'FINISHED'"
                  content="Baixar relatório"
                >
                  <a
                    :href="scope.row.httpUrl"
                    target="_blank"
                  >
                    <jus-icon
                      icon="download-sheet"
                      class="view-management__export-dialog-table-icon"
                    />
                  </a>
                </el-tooltip>
              </template>
            </el-table-column>
            <infinite-loading
              v-if="exportHistory.totalElements >= 10"
              slot="append"
              :distance="10"
              spinner="spiral"
              force-use-infinite-wrapper=".el-table__body-wrapper"
              @infinite="infiniteHandler"
            >
              <div slot="no-more">
                Fim do historico
              </div>
              <div slot="no-results">
                Fim do historico
              </div>
            </infinite-loading>
          </el-table>
        </el-card>
        <div class="view-management__export-dialog-titles">
          <span class="view-management__export-dialog-title">
            Nova exportação
            <el-button
              plain
              size="mini"
              @click="changeExportType"
            >
              {{ isExportingProtocol ? 'Exportar disputas' : 'Exportar minutas' }}
            </el-button>
          </span>
          <p class="view-management__export-dialog-subtitle">
            {{
              isExportingProtocol
                ? 'Exporte as minutas para o seu emial'
                : 'Selecione e ordene as colunas desejadas para exportação:'
            }}
          </p>
        </div>
        <el-card
          v-show="isExportingProtocol"
          shadow="never"
          class="view-management__export-dialog-card"
        >
          <div class="view-management__dialog-card-container">
            <span class="view-management__export-dialog-title">Exportar minuta</span>
            <p>Os documentos serão enviadas para seu email assim que estiverem prontos</p>
          </div>
        </el-card>
        <el-card
          v-show="!isExportingProtocol"
          shadow="never"
          class="view-management__export-dialog-card"
        >
          <div class="view-management__export-dialog-options">
            <el-checkbox
              v-model="isSelectedAllColumns"
              :indeterminate="isIndeterminate"
              @change="invertSelectionColumns"
            >
              Nome do campo ({{ checkedNodes }} de {{ columns.length }})
            </el-checkbox>
            <el-input
              v-model="filterQuery"
              size="small"
              placeholder="Buscar"
              prefix-icon="el-icon-search"
              clearable
            />
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
            @node-drag-end="nodeDragEnd"
          >
            <span
              slot-scope="{ node }"
              class="custom-tree-node"
            >
              <span>{{ node.label | capitalize }}</span>
              <jus-icon
                class="drag-icon"
                icon="menu-hamburger"
              />
            </span>
          </el-tree>
          <a
            href="#"
            class="view-management__export-dialog-link"
            @click="showAllNodesHandler"
          >
            {{ showAllNodesButton }}
          </a>
        </el-card>
        <span slot="footer">
          <el-button
            :disabled="loadingExport"
            plain
            @click="exportDisputesDialog = false"
          >
            Cancelar
          </el-button>
          <el-button
            :loading="loadingExport"
            type="primary"
            @click.prevent="handleExportReports"
          >
            Exportar e enviar para email
          </el-button>
        </span>
      </el-dialog>
    </template>
  </jus-view-main>
</template>

<script>
import { filterByTerm } from '@/utils/jusUtils'
import { mapActions, mapGetters } from 'vuex'

const defaultCheckedKeys = ['DISPUTE_CODE', 'EXTERNAL_ID', 'FIRST_CLAIMANT', 'LAWYER_PARTY_NAMES', 'RESPONDENT_NAMES', 'UPPER_RANGE', 'UPPER_RANGE_SAVING_VALUE', 'STATUS', 'CLASSIFICATION', 'DESCRIPTION']

export default {
  name: 'Management',
  components: {
    ManagementFilters: () => import('./partials/ManagementFilters'),
    ManagementTable: () => import('./partials/ManagementTable'),
    ManagementActions: () => import('./partials/ManagementActions'),
    ManagementPrescriptions: () => import('./partials/ManagementPrescriptions'),
    JusImportDialog: () => import('@/components/dialogs/JusImportDialog'),
    JusFilterButton: () => import('@/components/buttons/JusFilterButton'),
    JusLoader: () => import('@/components/others/JusLoader')
  },
  data() {
    return {
      loadingExport: false,
      filtersVisible: false,
      termDebounce: () => {},
      ufDebounce: () => {},
      disputeDebounce: '',
      selectedIds: [],
      importDialogVisible: false,
      exportDisputesDialog: false,
      isSelectedAllColumns: true,
      isIndeterminate: false,
      checkedNodes: 0,
      filterQuery: '',
      filteredNodes: {},
      columnsList: [],
      showAllNodes: false,
      isExportingProtocol: false,
      filteredBrazilianStates: [],
      ufFilterValue: []
    }
  },
  computed: {
    ...mapGetters({
      brazilianStates: 'getBrazilianStates',
      disputes: 'disputes',
      engagementLength: 'disputeNearExpirationsEngajement',
      interactionLength: 'disputeNotVisualizedInteration',
      isJusttoAdmin: 'isJusttoAdmin',
      newDealsLength: 'disputeNotVisualizedNewDeal',
      hasFilters: 'disputeHasFilters',
      hasNew: 'disputeHasNew',
      exportHistory: 'exportHistory',
      loadingDisputes: 'loadingDisputes',
      workspaceProperties: 'workspaceProperties'
    }),
    columns() {
      if (this.filterQuery || this.showAllNodes) {
        return this.columnsList
      } else {
        return this.columnsList.filter(n => defaultCheckedKeys.includes(n.key))
      }
    },
    showAllNodesButton() {
      return this.showAllNodes ? 'Exibir apenas apenas campos sugeridos' : 'Exibir mais opções de campos'
    },
    activeTab: {
      get() { return this.$store.getters.disputeTab },
      set(tab) { this.$store.commit('setDisputesTab', tab) }
    },
    multiActive() {
      return this.selectedIds.length >= 1
    },
    disputesTotalLength() {
      return this.$store.getters.disputeQuery.total
    },
    persons() {
      return this.$store.state.disputeModule.query.persons
    }
    // term: {
    //   get() {
    //     return this.$store.getters.disputeQueryTerm
    //   },
    //   set(term) {
    //     this.$store.commit('updateDisputeQuery', { key: 'term', value: term })
    //   },
    // },
  },
  watch: {
    // term(term) {
    //   clearTimeout(this.termDebounce)
    //   this.termDebounce = setTimeout(() => {
    //     this.$jusSegment('Busca de disputas na tabela do gerenciamento', { description: `Termo utilizado: ${term}` })
    //     this.getDisputes()
    //   }, 800)
    // },
    persons() {
      this.getDisputes()
    },
    filterQuery(val) {
      this.$refs.tree.filter(val)
    }
  },
  beforeCreate() {
    this.$store.dispatch('getNotVisualizeds')
    this.$store.dispatch('getNearExpirations')
  },
  created() {
    const query = this.$route.query

    if (Object.keys(query).length) {
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('addPrescription', query.prescription)
      this.$store.commit('updateDisputeQuery', { key: 'status', value: query.status || [] })
      this.$store.commit('updateDisputeQuery', { key: 'startDate', value: query.startDate })
      this.$store.commit('updateDisputeQuery', { key: 'finishDate', value: query.finishDate })
      this.$store.commit('updateDisputeQuery', { key: 'transactionType', value: query.transactionType })
      this.$store.commit('setDisputeHasFilters', query.disputeHasFilters)
      this.$store.commit('setDisputesTab', query.disputeTab)
    }

    this.getDisputes()
    this.getPrescriptions()
  },
  mounted() {
    this.getExportColumns().then(response => {
      Object.keys(response).forEach(key => {
        this.columnsList.push({
          key: key,
          label: response[key]
        })
      })
    }).finally(() => {
      this.filteredNodes = this.columns
      this.checkedNodes = this.columns.length
    })

    this.filteredBrazilianStates = this.brazilianStates
  },
  methods: {
    ...mapActions([
      'exportDisputes',
      'exportProtocols',
      'getExportColumns',
      'getExportHistory',
      'getPrescriptions'
    ]),
    ufSearch(value) {
      this.filteredBrazilianStates = filterByTerm(value, this.brazilianStates, 'name', 'value')
    },
    setUfFilter(data) {
      clearTimeout(this.ufDebounce)
      this.ufDebounce = setTimeout(() => {
        this.$jusSegment('Filtro por estado aplicado', { description: `Estados selecionados: ${data}` })
        this.$store.commit('updateDisputeQuery', { key: 'uf', value: data })
        this.getDisputes()
      }, 800)
    },
    changeExportType() {
      this.isExportingProtocol = !this.isExportingProtocol
    },
    showAllNodesHandler() {
      this.showAllNodes = !this.showAllNodes
    },
    filterColumns(value, data) {
      this.filteredNodes = filterByTerm(value, this.columns, 'label')
      this.handlerChangeTree('', { checkedKeys: this.$refs.tree.getCheckedKeys() })
      if (!value && this.showAllNodes) return true
      return data.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1
    },
    handlerChangeTree(value, obj) {
      setTimeout(function() {
        const checkedNodes = this.filteredNodes.filter(n => obj.checkedKeys.includes(n.key)).length
        const nodesLength = this.filteredNodes.length
        this.isSelectedAllColumns = checkedNodes === nodesLength
        this.isIndeterminate = checkedNodes > 0 && checkedNodes < nodesLength
        this.checkedNodes = obj.checkedKeys.length
      }.bind(this), 200)
    },
    invertSelectionColumns(value) {
      if (value) {
        const allNodesSelected = [...this.$refs.tree.getCheckedKeys(), ...this.filteredNodes.map(c => c.key)]
        this.$refs.tree.setCheckedKeys(allNodesSelected)
      } else {
        const filteredKeys = this.columns.filter(c => !this.filteredNodes.includes(c))
        this.$refs.tree.setCheckedKeys(filteredKeys.map(c => c.key))
      }
      this.isIndeterminate = false
      this.handlerChangeTree('', { checkedKeys: this.$refs.tree.getCheckedKeys() })
    },
    nodeDragEnd(draggingNode, dropNode, dropType, ev) {
      setTimeout(() => {
        this.$refs.tree.setChecked(draggingNode.data.key, draggingNode.checked)
      }, 100)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (type === 'prev') {
        return true
      }
      return false
    },
    getDisputes() {
      clearTimeout(this.disputeDebounce)
      this.disputeDebounce = setTimeout(() => {
        this.$store.dispatch('getFilteredTags')
        return this.$store.dispatch('getDisputes', 'resetPages').catch(error => {
          if (this.$store.getters.isLoggedIn) {
            this.$jusNotification({ error })
          }
        }).finally(() => {
          this.$nextTick(() => {
            const main = this.$el.querySelector('.el-table__body-wrapper')
            if (main) {
              main.scrollTop = 0
            }
          })
          if (this.$refs.managementTable) this.$refs.managementTable.disputeKey += 1
        })
      }, 300)
    },
    clearSelection() {
      this.$refs.managementTable.clearSelection()
    },
    handleChangeTab(tab) {
      this.$refs.managementTable.showEmpty = false
      this.ufFilterValue = []
      this.$store.commit('clearDisputes')
      this.$store.commit('clearDisputeQueryByTab')
      this.$store.commit('setDisputeHasFilters', false)
      // SEGMENT TRACK
      this.$jusSegment(`Navegação na aba ${this.$t('tab.' + tab).toUpperCase()}`)
      switch (tab) {
        case '-1':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['PRE_NEGOTIATION'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['expirationDate,asc'] })
          break
        case '0':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['expirationDate,asc'] })
          break
        case '1':
          this.$store.commit('updateDisputeQuery', { key: 'status', value: ['RUNNING'] })
          this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'lastReceivedMessage,asc', 'expirationDate,asc'] })
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
    showExportDisputesDialog() {
      this.getExportHistory()
      this.exportDisputesDialog = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.columns.map(c => c.key))
        this.handlerChangeTree('', { checkedKeys: this.$refs.tree.getCheckedKeys() })
      })
    },
    handleExportReports() {
      const action = this.isExportingProtocol ? this.exportProtocols() : this.exportDisputes(this.$refs.tree.getCheckedKeys())
      this.loadingExport = true

      action.then(() => {
        // SEGMENT TRACK
        this.$jusSegment(this.isExportingProtocol ? 'Exportar minutas' : 'Exportar disputas')
        this.$alert('Solicitação realizada com sucesso, por favor aguarde nosso email com seu relatório', 'Exportação de relatórios', { confirmButtonText: 'Ok' })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loadingExport = false
        this.exportDisputesDialog = false
      })
    },
    exportSituation(request) {
      if (request.error) {
        return 'FAILED'
      } else if (request.exportFinishedAt) {
        return 'FINISHED'
      } else if (request.exportStartedAt) {
        return 'PROCESSING'
      } else {
        return 'QUEUE'
      }
    },
    exportDateTime(requestTime) {
      return this.$moment(requestTime * 1000).format('DD/MM/YYYY | HH:mm')
    },
    buildSituationTooltip(request) {
      if (this.exportSituation(request) === 'FAILED') {
        return `Exportação iniciada em: ${this.exportDateTime(request.exportStartedAt)} <br> Falha na exportação: ${request.error} <br> `
      } else if (this.exportSituation(request) === 'QUEUE') {
        return 'A exportação está na fila e será iniciada em breve'
      } else {
        return `Exportação iniciada em: ${this.exportDateTime(request.exportStartedAt)}`
      }
    },
    exportHistoryRowClass({ row }) {
      switch (this.exportSituation(row)) {
        case 'FAILED':
          return 'failed-row'
        case 'FINISHED':
          return 'finished-row'
        case 'PROCESSING':
          return 'processing-row'
        case 'QUEUE':
          return 'queue-row'
      }
    },
    infiniteHandler($state) {
      this.getExportHistory('isInfinit').then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
        }
      })
    },
    showImportDialog() {
      // SEGMENT TRACK
      this.$jusSegment('Botão importação rápida')
      this.importDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.view-management {
  &__filters {
    display: flex;
    justify-content: space-between;
  }
  &__buttons {
    // .el-input + button {
    //   margin-left: 10px;
    // }
    // .el-input {
    //   width: 180px;
    //   vertical-align: middle;
    // }

    .view-management__buttons-select {
      margin: 0 8px;
      width: 108px;

      .el-input {
        width: 108px;
      }

      .el-select__tags {
        max-width: 88px !important;

        .el-tag:first-child {
          padding: 0 0 0 4px;
          .el-tag__close { right: 0; }
        }

        .el-tag:last-child {
          padding: 0 4px;
          margin-left: 4px;
        }

        .el-select__input {
          max-width: 20px !important;
          margin-left: 8px !important;
        }
      }
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

    .view-management__export-dialog-table-icon {
      width: 14px;
    }

    .view-management__export-dialog-titles {
      color: $--color-text-secondary;
      margin-top: 24px;

      .view-management__export-dialog-title {
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .view-management__export-dialog-subtitle {
        margin: 8px 16px;
      }

      &:last-child {
        margin-top: 0px;
      }
    }

    .view-management__export-dialog-options {
      background-color: $--color-white;
      margin-bottom: 4px;
      position: sticky;
      height: 42px;
      top: 0;
      padding-top: 12px;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .el-input {
        width: 200px;
        margin-right: 10px;
      }

      .el-checkbox {
        font-weight: 500;
        &__label {
          color: #343c4b !important;
        }
      }
    }

    .view-management__export-dialog-link {
      display: block;
      margin-top: 8px;
    }

    .view-management__export-dialog-card {
      overflow: auto;

      .view-management__dialog-card-container {
        height: 332px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: $--color-text-secondary;
        text-align: center;

        .view-management__export-dialog-title {
          font-size: 20px;
          font-weight: bold;
          margin-top: 16px;
        }
      }

      .el-card__body {
        padding: 0 16px 16px 16px;
        max-height: 348px;
        overflow: auto;
      }

      .el-tree-node__expand-icon.is-leaf {
        display: none;
      }
    }
  }

  .view-management__tabs {
    .el-tabs__header  {
      @media (max-height: 680px) {
        margin: 0 0 8px;
      }
    }
  }

}

.view-management__select-options {
  float: right;
  color: #8492a6;
  margin: 0 16px 0 8px
}

.el-table {
  .finished-row {
    color: $--color-success;
    color: #28ac5c;
    // font-weight: bold;
  }
  .failed-row {
    color: $--color-danger;
  }
  .processing-row {
    color: $--color-warning;
  }
  .queue-row {
    color: $--color-text-regular;
  }
}
</style>
