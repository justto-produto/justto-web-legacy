<template>
  <JusViewMain class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
      <management-carousel />
    </template>
    <template slot="actions">
      <div :class="{'active': multiActive}" class="view-management__multi-actions">
        Casos selecionados: {{ selectedIds.length }}
        <div>
          <el-button plain @click="sendBatchAction('SETTLED')">{{ $t('action.SETTLED') }}</el-button>
          <el-button plain @click="sendBatchAction('UNSETTLED')">{{ $t('action.UNSETTLED') }}</el-button>
          <el-button plain @click="sendBatchAction('PAUSED')">{{ $t('action.PAUSED') }}</el-button>
          <el-button plain @click="sendBatchAction('RESUME')">{{ $t('action.RESUME') }}</el-button>
          <el-button plain @click="sendBatchAction('DELETE')">{{ $t('action.DELETE') }}</el-button>
          <el-button plain @click="sendBatchAction('RESTART_ENGAGEMENT')">{{ $t('action.RESTART_ENGAGEMENT') }}</el-button>
          <!-- <el-button plain @click="sendBatchAction('CHANGE_NEGOTIATOR')">Alterar responsável</el-button> -->
          <!-- <el-button plain @click="sendBatchAction('CHANGE_CAMPAIGN')">Alterar campanha</el-button> -->
        </div>
        <i class="el-icon-close" @click="clearSelection()"/>
      </div>
    </template>
    <template slot="main">
      <div class="view-management__actions">
        <el-button
          icon="el-icon-refresh"
          plain
          @click="getDisputes">
          Atualizar
        </el-button>
        <el-button
          :plain="!Object.keys(filters.terms).length"
          :type="Object.keys(filters.terms).length ? 'primary' : ''"
          @click="showFilters = true">
          <jus-icon :is-white="!!Object.keys(filters.terms).length" icon="filter" />
          Filtrar
        </el-button>
        <el-button
          :loading="loadingExport"
          :disabled="disputes.length === 0"
          plain
          icon="el-icon-download"
          @click="exportDisputes">
          Exportar casos
        </el-button>
      </div>
      <el-tabs
        ref="management-tabs"
        :before-leave="handleChangeTab"
        v-model="activeTab.index"
        class="view-management__tabs">
        <el-tab-pane name="0" label="Engajamento" />
        <el-tab-pane name="1" label="Com interação" />
        <el-tab-pane name="2" label="Novos acordos" />
        <el-tab-pane name="3" label="Todos" />
      </el-tabs>
      <el-table
        v-loading="loadingDisputes"
        ref="disputeTable"
        :data="disputes"
        size="small"
        class="el-table--card"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="Campanha">
          <template slot-scope="scope">{{ scope.row.campaignname }}</template>
        </el-table-column>
        <el-table-column
          label="Parte(s) contrária(s)"
          class-name="fixed-width">
          <template slot-scope="scope">
            <el-popover
              title="Partes contrárias"
              trigger="hover">
              <div v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
                {{ claimant.name }}
              </div>
              <ul>
                <li v-for="(claimant, index) in scope.row.claiments" :key="claimant + index">
                  {{ claimant.name }}
                </li>
              </ul>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          v-if="activeTab.index !== '3'"
          label="Advogado(s) da parte"
          class-name="fixed-width">
          <template slot-scope="scope">
            <el-popover
              title="Advogados da parte"
              trigger="hover">
              <div v-for="(lawyer, index) in scope.row.claimentslawyer" slot="reference" :key="lawyer + index">
                {{ lawyer.name }}
              </div>
              <ul>
                <li v-for="(lawyer, index) in scope.row.claimentslawyer" :key="lawyer + index">
                  {{ lawyer.name }}
                </li>
              </ul>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab.index !== '3'" label="Alçada máxima">
          <template slot-scope="scope">{{ scope.row.disputeupperrange | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab.index === '0'" label="Valor proposto">
          <template slot-scope="scope">{{ scope.row.disputelastrespondentoffer | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab.index === '1'" label="Contraproposta">
          <template slot-scope="scope">{{ scope.row.lastoffervalue | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab.index === '1'" label="Última interação">
          <template slot-scope="scope">{{ scope.row.lastinteractiondate | moment('DD/MM/YY') }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab.index === '2'" label="Valor do acordo">
          <template slot-scope="scope">{{ scope.row.disputedealvalue | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab.index < '2'" label="Fim da negociação">
          <template slot-scope="scope">{{ scope.row.disputeexpirationdate | moment('DD/MM/YY') }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab.index === '3'" label="Status">
          <template slot-scope="scope">
            {{ $t('occurrence.type.' + scope.row.disputestatus) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab.index === '0'" label="Msgs enviadas">
          <template slot-scope="scope">
            <span v-if="!scope.row.communicationmsgtotalsent && !scope.row.communicationmsgtotalschedulled">
              Enriquecendo
            </span>
            <span v-else>
              {{ scope.row.communicationmsgtotalsent }} /
              {{ scope.row.communicationmsgtotalschedulled }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Ações"
          width="100px"
          class-name="view-management__row-actions"
          align="center">
          <template slot-scope="scope">
            <!-- <el-popover trigger="hover">
              <div>
                <strong>Responsáveis:</strong><br>
                <span v-for="(negotiator, index) in scope.row.negotiators" :key="negotiator.f1 + index">
                  {{ negotiator.f1 }}
                </span>
              </div>
              <br>
              <div>
                <strong>Estratégia:</strong><br>
                {{ scope.row.strategyname }}
              </div>
              <jus-icon slot="reference" icon="more-info" />
            </el-popover> -->
            <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
              <el-button
                type="text"
                class="favorite"
                @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeid, 'ENGAJAMENTO')">
                <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Visualizar caso">
              <router-link :to="{ name: 'case', params: { id: scope.row.disputeid } }">
                <jus-icon icon="open-case" />
              </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <template v-if="!$store.state.loading" slot="empty">
          <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
          <h4 style="font-weight: normal">Não foram encontrados casos para<br>os filtros e aba selecionados.</h4>
        </template>
      </el-table>
      <el-dialog :visible.sync="showFilters" @open="restoreFilters()">
        <template slot="title">
          <h2>Filtrar {{ activeTab.label }}</h2>
        </template>
        <jus-management-filters
          :tab-index="activeTab.index"
          :filters.sync="activeFilters"/>
        <span slot="footer">
          <el-button plain @click="clearFilters()">Limpar filtros</el-button>
          <el-button
            type="primary"
            @click="applyFilters()">
            Aplicar filtros
          </el-button>
        </span>
      </el-dialog>
    </template>
  </JusViewMain>
</template>

<script>
import JusManagementFilters from '@/components/others/JusManagementFilters'
import ManagementCarousel from './carousel/ManagementCarousel'

export default {
  name: 'Management',
  components: {
    ManagementCarousel,
    JusManagementFilters
  },
  data () {
    return {
      showFilters: false,
      selectedIds: [],
      activeFilters: {},
      activeTab: this.getActiveTabLabel(this.$store.state.disputeModule.filters.tab),
      loadingExport: false,
      loadingDisputes: false
    }
  },
  computed: {
    multiActive () {
      return this.selectedIds.length >= 1
    },
    disputes () {
      return this.$store.getters.filteredDisputes
    },
    filters () {
      return this.$store.state.disputeModule.filters
    }
  },
  beforeMount () {
    this.$store.dispatch('getCampaigns')
    this.$store.dispatch('getStrategies')
    this.getDisputes()
  },
  methods: {
    getDisputes () {
      this.loadingDisputes = true
      this.$store.dispatch('getDisputes', { query: { bool: {} }, from: 0, size: 3000, order_by: 'favorite DESC' }).then(response => {
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.loadingDisputes = false
      })
    },
    handleSelectionChange (selected) {
      this.selectedIds = []
      for (let dispute of selected) {
        if (dispute && dispute.disputeid) {
          this.selectedIds.push(dispute.disputeid)
        }
      }
    },
    handleChangeTab (newTab, oldTab) {
      if (oldTab !== undefined) {
        this.$store.commit('setDisputeTab', newTab)
        this.clearSelection()
        this.clearFilters()
        this.activeTab = this.getActiveTabLabel(newTab)
      }
    },
    exportDisputes () {
      this.loadingExport = true
      this.$store.dispatch('exportDisputes', this.currentQuery).then(response => {
        // eslint-disable-next-line
        window.open('/api/export/' + response)
        window.analytics.track('Planilha de "' + this.activeTab.label + '" exportada')
      }).finally(() => {
        this.loadingExport = false
      })
    },
    getActiveTabLabel (newTab) {
      let newActive
      switch (newTab) {
        case '0':
          newActive = { index: '0', label: 'Engajamento' }
          break
        case '1':
          newActive = { index: '1', label: 'Com interação' }
          break
        case '2':
          newActive = { index: '2', label: 'Novos acordos' }
          break
        case '3':
          newActive = { index: '3', label: 'Todos' }
          break
        default:
          newActive = { index: 0, label: 'Engajamento' }
      }
      return newActive
    },
    clearSelection () {
      if (this.$refs.disputeTable) this.$refs.disputeTable.clearSelection()
    },
    applyFilters () {
      this.$store.commit('setDisputeFilter', this.activeFilters)
      this.showFilters = false
      window.analytics.track('Filtro aplicado', {
        filters: this.filters,
        tab: this.activeTab.label ? this.activeTab.label : this.activeTab.label = 'Engajamento'
      })
    },
    clearFilters () {
      this.showFilters = false
      this.$store.commit('clearDisputeFilters')
    },
    restoreFilters () {
      this.activeFilters = JSON.parse(JSON.stringify(this.filters.terms))
    },
    setFavorite (action, id, tab) {
      let label = action === 'favorite' ? 'favoritado' : 'removido de favoritos'
      this.$store.dispatch('sendDisputeAction', {
        action: action,
        disputeId: id
      }).then(() => {
        window.analytics.track('Caso em "' + tab + '" ' + label, {
          aba: tab,
          action: label
        })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Caso ' + label + ' com sucesso.',
          type: 'success'
        })
        let self = this
        setTimeout(function () {
          self.getCases()
        }, 1500)
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      })
    },
    sendBatchAction (action) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('sendBatchAction', {
          type: action,
          disputeIds: this.selectedIds
        }).then(response => {
          window.analytics.track('Ação em massa realizada', {
            action: action,
            tab: this.activeTab.label ? this.activeTab.label : this.activeTab.label = 'Engajamento',
            selecteds: this.selectedIds.length
          })
          let self = this
          this.$jusNotification({
            title: 'Yay!',
            message: 'Ação ' + this.$t('action.' + action) + ' realizada com sucesso.',
            type: 'success',
            onClose () {
              setTimeout(function () {
                self.$jusNotification({
                  title: 'Fique atento!',
                  message: `Algumas ações em lote podem demorar até serem executadas em nosso sistema.
                  Caso sua ação ainda não tenha refletido em seus casos, aguarde um pouco mais e utilize o botão de atualizar os casos.`,
                  type: 'info'
                })
              }.bind(self), 300)
            }
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.view-management {
  .jus-main-view__title {
    position: relative;
  }
  &__carousel-container {
    position: absolute;
    top: -26px;
    right: 0;
    width: 70%;
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      width: 20px;
      font-size: 1.4rem;
      color: #adadad;
    }
    .owl-nav {
      position: absolute;
      top: 0;
      left: 4px;
      right: -6px;
      bottom: 0;
      margin: 0px -31px 0 -41px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .owl-stage-outer {
      border-radius: 5px;
      z-index: 1;
    }
    .owl-prev, .owl-next {
      background: transparent !important;
    }
  }
  &__carousel-slider {
    margin-right: 34px;
  }
  &__tabs {
    .el-tabs__header {
      width: fit-content;
      padding: 0 20px;
      margin: 0 0 35px;
    }
  }
  &__actions {
    display: inline-flex;
    position: absolute;
    right: 318px;
    right: 20px;
    top: 20px;
    .el-button {
      line-height: 14px;
      padding: 8px 18px;
    }
    img {
      vertical-align: sub;
      width: 14px;
    }
  }
  .el-table__header {
    .fixed-width {
      .cell {
        width: 175px;
      }
    }
  }
  .el-table__body {
    .fixed-width {
      .cell {
        width: 175px;
        white-space: nowrap;
        .el-popover__reference {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .cell {
      text-transform: capitalize;
      &.names {
        max-width: 158px;
      }
    }
  }
  .jus-main-view__main-card > .el-card__body {
    position: relative;
    height: 100%;
    padding: 20px 0;
  }
  .el-carousel {
    width: 65%;
  }
  .el-carousel__item {
    display: flex;
  }
  .el-tabs__active-bar {
    width: 97px;
  }
  &__multi-actions {
    position: absolute;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 3;
    padding: 0 20px;
    transition: all 0.5s ease;
    display: flex;
    justify-content:space-between;
    align-items: center;
    margin: -44px 22px 0;
    transform: translateY(-100%);
    border-radius: 5px 5px 0 0;
    div {
      display: flex;
    }
    &.active {
      box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
      margin: 0px 22px;
      transform: translateY(0%);
    }
    i {
      cursor: pointer;
      text-align: right;
    }
    button {
      height: 68px;
      padding: 8px 20px;
      border: 0;
      border-radius: 0;
      text-transform: uppercase;
      &:hover {
        background-color: #fafafa !important;
      }
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  &__row-actions {
    img {
      width: 20px;
      vertical-align: middle;
    }
    span + button, button + a {
      margin-left: 6px;
    }
  }
  &__empty-table {
    margin-top: 40px;
    width: 60px;
  }
  .jus-main-view__container {
    position: relative;
  }
}
</style>
