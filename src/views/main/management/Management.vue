<template>
  <jus-view-main
    :loading-main="loadingDisputes"
    class="view-management"
  >
    <template slot="main">
      <management-actions
        :active-tab="activeTab"
        :selected-ids.sync="selectedIds"
        @disputes:clear="clearSelection"
      />

      <div class="view-management__filters">
        <span
          v-if="isManagementAll"
          class="view-management__title"
        >
          Todas as disputas
        </span>

        <el-tabs
          v-else
          ref="disputeTabs"
          v-model="activeTab"
          :before-leave="handleChangeTab"
          class="view-management__tabs"
        >
          <el-tab-pane
            v-if="isJusttoAdmin || workspaceProperties.PRE_NEGOTIATION"
            name="0"
          >
            <span slot="label">
              Pré-Negociação
              <el-badge
                :hidden="!preNegotiationLenght"
                :value="preNegotiationLenght"
                :max="99"
                data-testid="badge-tab-1"
                type="primary"
                class="el-badge--absolute"
              />
            </span>
          </el-tab-pane>

          <el-tab-pane name="1">
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

          <el-tab-pane name="2">
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

          <el-tab-pane name="3">
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

          <el-tab-pane name="4">
            <span
              slot="label"
              :style="!finishedLenght ? '' : finishedLenght > 99 ? 'padding-right: 38px;' : finishedLenght > 9 ? 'padding-right: 30px;' : 'padding-right: 22px;'"
            >
              Finalizados
              <el-badge
                :hidden="!finishedLenght"
                :value="finishedLenght"
                :max="99"
                data-testid="badge-tab3"
                type="primary"
                class="el-badge--absolute"
              />
            </span>
          </el-tab-pane>
        </el-tabs>

        <div class="view-management__buttons">
          <JusFilterButton
            ref="JusFilterButton"
            @getDisputes="getDisputes"
          />

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
              class="view-management__buttons-button"
              :type="hasFilters ? 'primary' : 'secondary'"
              @click="showManagementFilters"
            >
              <jus-icon
                :is-white="hasFilters"
                :is-active="!hasFilters"
                icon="filter"
                data-testid="management-filterbtn"
              />
            </el-button>
          </el-tooltip>

          <el-tooltip content="Importar disputas">
            <el-button
              class="view-management__buttons-button"
              type="secondary"
              @click="showImportDialog"
            >
              <jus-icon
                icon="upload-file"
                size="16px"
                is-active
              />
            </el-button>
          </el-tooltip>

          <el-tooltip content="Exportar">
            <el-button
              class="view-management__buttons-button"
              :disabled="disputes.length === 0"
              type="secondary"
              icon="el-icon-download"
              data-testid="export-disputes"
              @click="showExportDisputesDialog"
            />
          </el-tooltip>

          <jus-import-dialog :dialog-visible.sync="importDialogVisible" />
        </div>
      </div>

      <ManagementFilters
        ref="managementFilters"
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
        @search:lawyer="filterLawyer"
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
          v-loading="scrollLoading"
          shadow="never"
          class="view-management__export-dialog-card"
        >
          <el-table
            :data="exportHistory.content"
            :row-class-name="exportHistoryRowClass"
            height="150"
            class="view-management__export-dialog-table"
            empty-text="Você ainda não realizou exportações..."
          >
            <el-table-column
              label="Situação"
              align="center"
              header-align="center"
            >
              <template #default="scope">
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
              <template #default="scope">
                <span>{{ exportDateTime(scope.row.requestedAt) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="Conclusão"
              align="center"
              header-align="center"
            >
              <template #default="scope">
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
              <template #default="scope">
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

            <JusScrollLoading
              slot="append"
              :loading.sync="scrollLoading"
              target=".view-management__export-dialog-table>.el-table__body-wrapper"
              :ended="exportHistory.last"
              :empty="!(exportHistory.content && exportHistory.content.length > 0)"
              empty-text="Fim do historico"
              end-text="Fim do historico"
              @load="infiniteHandler"
            />
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
                ? 'Exporte as minutas para o seu email'
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
              Nome do campo &lpar;{{ filteredCountCheckeds }} de {{ countTreeItems }}&rpar;
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
import { filterByTerm, eventBus } from '@/utils'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import lodash from 'lodash'
import events from '@/constants/negotiationEvents'

const defaultCheckedKeys = ['DISPUTE_CODE', 'EXTERNAL_ID', 'FIRST_CLAIMANT', 'LAWYER_PARTY_NAMES', 'RESPONDENT_NAMES', 'UPPER_RANGE', 'UPPER_RANGE_SAVING_VALUE', 'STATUS', 'CLASSIFICATION', 'DESCRIPTION']

export default {
  name: 'Management',

  components: {
    JusScrollLoading: () => import('@/components/others/JusScrollLoading'),
    ManagementFilters: () => import('./partials/ManagementFilters'),
    ManagementTable: () => import('./partials/ManagementTable'),
    ManagementActions: () => import('./partials/ManagementActions'),
    ManagementPrescriptions: () => import('./partials/ManagementPrescriptions'),
    JusImportDialog: () => import('@/components/dialogs/JusImportDialog'),
    JusFilterButton: () => import('@/components/buttons/JusFilterButton'),
    JusLoader: () => import('@/components/others/JusLoader')
  },

  inject: {
    isTicket: {
      default: false
    }
  },

  data() {
    return {
      loadingExport: false,
      termDebounce: () => {},
      ufDebounce: () => {},
      disputeDebounce: '',
      // selectedIds: [],
      importDialogVisible: false,
      exportDisputesDialog: false,
      checkedNodes: 0,
      filterQuery: '',
      filteredNodes: {},
      columnsList: [],
      showAllNodes: false,
      isExportingProtocol: false,
      filteredBrazilianStates: [],
      ufFilterValue: [],
      exportedColumns: [],
      scrollLoading: false
    }
  },

  computed: {
    ...mapGetters({
      brazilianStates: 'brazilianStates',
      disputes: 'disputes',
      engagementLength: 'disputeNearExpirationsEngajement',
      interactionLength: 'disputeNotVisualizedInteration',
      preNegotiationLenght: 'disputeNotVisualizedPreNegotiation',
      isJusttoAdmin: 'isJusttoAdmin',
      newDealsLength: 'disputeNotVisualizedNewDeal',
      finishedLenght: 'disputeNotVisualizedFinished',
      hasFilters: 'disputeHasFilters',
      hasNew: 'disputeHasNew',
      exportHistory: 'exportHistory',
      loadingDisputes: 'loadingDisputes',
      workspaceProperties: 'workspaceProperties',
      getSelectedIds: 'getSelectedIds',
      userProperties: 'userProperties',
      hasPreventFiltres: 'getDisputeHasPreventFiltres',
      workspaceId: 'workspaceId'
    }),

    selectedIds: {
      get() {
        return this.getSelectedIds
      },
      set(ids) {
        this.setSelectedIds(ids)
      }
    },

    columns() {
      let result = []
      if (this.exportedColumns.length && !this.showAllNodes) {
        result = this.exportedColumns
      } else if (this.filterQuery?.length || this.showAllNodes) {
        result = this.columnsList
      } else {
        result = this.columnsList.filter(n => defaultCheckedKeys.includes(n.key))
      }

      return result
    },

    countTreeItems() {
      return (this.filterQuery?.length ? this.filteredNodes : this.columns).length
    },

    filteredCountCheckeds() {
      return this.checkedNodes <= this.countTreeItems ? this.checkedNodes : this.countTreeItems
    },

    showAllNodesButton() {
      return this.showAllNodes ? 'Exibir apenas apenas campos sugeridos' : 'Exibir mais opções de campos'
    },

    activeTab: {
      get() { return this.$store.getters.disputeTab },
      set(tab) {
        this.$store.commit('setDisputesTab', tab)
        this.$emit('change:tab', tab)
      }
    },

    disputesTotalLength() {
      return this.$store.getters.disputeQuery.total
    },

    persons() {
      return this.$store.state.disputeModule.query.persons
    },

    isManagementAll() {
      return this.$route.name === 'allDisputes'
    },

    isIndeterminate() {
      return this.filteredCountCheckeds > 0 && this.filteredCountCheckeds < this.countTreeItems
    },

    isSelectedAllColumns: {
      get() {
        return this.filteredCountCheckeds === this.countTreeItems
      },
      set(_value) {}
    }
  },

  watch: {
    persons() {
      this.getDisputes()
    },

    filterQuery(current, _last) {
      this.$refs.tree.filter(current)

      this.handlerChangeTree('', {
        checkedKeys: this.$refs.tree.getCheckedKeys()
      })
    }
  },

  beforeCreate() {
    this.$store.dispatch('resetRecipients')
    this.$store.dispatch('getNotVisualizeds')
    this.$store.dispatch('getNearExpirations')
  },

  mounted() {
    this.init()
    this.$jusSegment('Acesso tela Gerenciamento', {})
    eventBus.$on(events.TICKET_NEXT_TAB.callback, this.handleNextTab)
    eventBus.$on(events.TICKET_PREVIOUS_TAB.callback, this.handlePreviousTab)

    if (this.userProperties?.PREFERRED_INTERFACE !== 'DISPUTE') {
      this.setAccountProperty({ PREFERRED_INTERFACE: 'DISPUTE' })
    }
  },

  beforeDestroy() {
    eventBus.$off(events.TICKET_NEXT_TAB.callback, this.handleNextTab)
    eventBus.$off(events.TICKET_PREVIOUS_TAB.callback, this.handlePreviousTab)
  },

  methods: {
    ...mapActions([
      'setSelectedIds',
      'exportDisputes',
      'exportProtocols',
      'getExportColumns',
      'getExportHistory',
      'getPrescriptions',
      'getAccountProperty',
      'setAccountProperty',
      'getAllAccountProperties'
    ]),

    ...mapMutations(['setDisputePreventFilters']),

    handleNextTab() {
      const current = Number(this.activeTab)
      if (current < 4) {
        this.activeTab = String(current + 1)
        this.handleChangeTab(this.activeTab)
      }
    },

    handlePreviousTab() {
      const current = Number(this.activeTab)
      if (current > 0) {
        this.activeTab = String(current - 1)
        this.handleChangeTab(this.activeTab)
      }
    },

    init() {
      const query = this.$route.query

      if (this.$route.name === 'allDisputes' && this.$store.state.disputeModule.tab !== '9') {
        this.$store.commit('setDisputesTab', '9')
        this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
        this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['id,desc'] })
      }

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

    showManagementFilters() {
      this.$refs.managementFilters.openDialog()
    },

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
      const filteredKeys = this.filteredNodes.map(({ key }) => key)
      const checkedKeys = this.$refs.tree.getCheckedKeys().filter(key => filteredKeys.includes(key))

      this.handlerChangeTree('', { checkedKeys })

      if (!value && this.showAllNodes) return true
      return data.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1
    },

    handlerChangeTree(_value, { checkedKeys }) {
      setTimeout(function() {
        if (this.filterQuery?.length) {
          this.checkedNodes = this.filteredNodes.filter(({ key }) => checkedKeys.includes(key)).length
        } else {
          this.checkedNodes = checkedKeys.length
        }
      }.bind(this), 200)
    },

    invertSelectionColumns(value) {
      setTimeout(() => {
        const { tree } = this.$refs // Componente de que lista os itens.

        const dataKeys = tree.data.map(({ key }) => key) // Todos os itens que o componente tem acesso.
        const filteredKeys = this.filteredNodes.map(({ key }) => key) // Itens filtrados que estão marcados.
        const wereAlreadyMarked = tree.getCheckedKeys() // Todos os itens marcados.

        let toCheck = [] // Lista de chaves que serão marcadas.

        if (value) { // Clicou para marcar
          if (this.filterQuery?.length) { // Tem filtro
            toCheck = lodash.uniq([...filteredKeys, ...wereAlreadyMarked]) // Marca todos os itens que já estavam marcados, mais os itens filtrados.
          } else { // Não tem filtro
            toCheck = dataKeys // Marca todos os itens que o componente tem acesso.
          }
        } else { // Clicou para desmarcar
          if (this.filterQuery?.length) { // Tem filtro
            toCheck = wereAlreadyMarked.filter(key => !filteredKeys.includes(key)) // Marca todos os items que já estão marcados, menos os que estão no filtro.
          } else { // Não tem filtro
            toCheck = [] // Não marca nenhum item.
          }
        }

        tree.setCheckedKeys(toCheck) // Marca os itens.

        this.handlerChangeTree('', { checkedKeys: toCheck }) // Atualiza o contador de itens marcados.
      }, 250)
    },

    nodeDragEnd(draggingNode, _dropNode, _dropType, _ev) {
      setTimeout(() => {
        this.$refs.tree.setChecked(draggingNode.data.key, draggingNode.checked)
      }, 100)
    },

    allowDrop(_draggingNode, _dropNode, type) {
      return type === 'prev'
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

      // Estava duplicando o GET dos Tickets na mudança de Aba.
      // this.$emit('management:getDisputes')
    },

    clearSelection() {
      this.$refs.managementTable.clearSelection()
    },

    handleChangeTab(tab) {
      if (this.$refs.managementTable) {
        this.$refs.managementTable.clearHighlight()
        this.$refs.managementTable.showEmpty = false
      }

      if (this.hasPreventFiltres) {
        this.setDisputePreventFilters(false)
      } else {
        this.setDisputePreventFilters(false)
        this.ufFilterValue = []
        this.$store.commit('clearDisputes')
        this.$store.commit('clearDisputeQueryByTab')
        this.$store.commit('setDisputeHasFilters', false)
        // SEGMENT TRACK
        this.$jusSegment(`Navegação na aba ${this.$t('tab.' + tab).toUpperCase()} do Gerenciamento`)

        switch (tab) {
          case '0':
            this.$store.commit('updateDisputeQuery', { key: 'status', value: ['PRE_NEGOTIATION'] })
            this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['expirationDate,asc'] })
            break
          case '1':
            this.$store.commit('updateDisputeQuery', { key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
            this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['expirationDate,asc'] })
            break
          case '2':
            this.$store.commit('updateDisputeQuery', { key: 'status', value: ['RUNNING'] })
            this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'lastInboundInteraction.createdAt,desc', 'expirationDate,asc'] })
            break
          case '3':
            this.$store.commit('updateDisputeQuery', { key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
            this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'conclusionDate,asc'] })
            break
          case '4':
            this.$store.commit('addPrescription', 'NEWLY_FINISHED')
            this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
            this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'lastReceivedMessage,asc'] })
            break
          default:
            this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
            this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['id,desc'] })
        }
      }

      this.getDisputes()
    },

    showExportDisputesDialog() {
      this.exportDisputesDialog = true

      this.getAllAccountProperties().then(res => {
        const key = Object.keys(res).includes(`JUS_EXPORT_COLUMNS_${this.workspaceId}`) ? `JUS_EXPORT_COLUMNS_${this.workspaceId}` : 'JUS_EXPORT_COLUMNS'

        if (Object.keys(res).includes(key)) {
          const columns = res[key].split(',')
          this.exportedColumns = this.columnsList.filter(item => columns.includes(item.key))

          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(columns)
            this.checkedNodes = columns.length
          })
        } else {
          this.$refs.tree.setCheckedKeys(this.columns.map(c => c.key))
        }
      })

      this.getExportHistory()
      this.$nextTick(() => {
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

    infiniteHandler(callback) {
      this.getExportHistory('isInfinit').then(callback)
    },

    showImportDialog() {
      // SEGMENT TRACK
      this.$jusSegment('Botão importação rápida')
      this.importDialogVisible = true
    },

    filterLawyer({ lawyer }) {
      this.$refs.JusFilterButton.toggle()
      this.$store.commit('updateDisputeQuery', { key: 'term', value: lawyer })
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.view-management {
  .view-management__title {
    height: 40px;
    margin-bottom: 15px;
    line-height: 40px;
    font-size: 20px;
    font-weight: 500;
    color: $--color-text-primary;
  }
  &__filters {
    display: flex;
    justify-content: space-between;
  }
  &__buttons {
    display: flex;

    &.show-menu-space {
      margin-right: 40px;
    }

    .view-management__buttons-button {
      height: 40px;
    }

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
          color: $--color-text-primary !important;
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
      @media (max-height: 780px) {
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
  }
  .failed-row {
    color: $--color-danger;
  }
  .processing-row {
    color: $--color-warning;
  }
  .queue-row {
    color: $--color-text-primary;
  }
}
</style>
