<template>
  <JusViewMain class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
      <management-carousel />
    </template>
    <template slot="actions">
      <management-actions
        :active="multiActive"
        :selected-ids="selectedIds"
        :tab-label="activeTab.label"
        @disputes:clear="clearSelection"
      />
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
          Exportar disputas
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
        <el-table-column v-if="activeTab.index === '2'" label="Data do acordo">
          <template slot-scope="scope">{{ scope.row.disputedealdate | moment('DD/MM/YY') }}</template>
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
          width="95px"
          class-name="view-management__row-actions"
          align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
              <el-button
                type="text"
                @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeid, 'ENGAJAMENTO')">
                <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Visualizar disputa">
              <router-link :to="{ name: 'dispute', params: { id: scope.row.disputeid } }">
                <jus-icon icon="open-case" />
              </router-link>
            </el-tooltip>
            <el-tooltip content="Abrir disputa em uma nova aba">
              <el-button
                type="text"
                @click="openNewTab(scope.row.disputeid)">
                <jus-icon icon="external" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <template v-if="!$store.state.loading" slot="empty">
          <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
          <h4 style="font-weight: normal; line-height: initial;">
            Não foram encontradas disputas para<br>os filtros e aba selecionados.
          </h4>
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
import ManagementCarousel from './partials/ManagementCarousel'
import ManagementActions from './partials/ManagementActions'

export default {
  name: 'Management',
  components: {
    ManagementCarousel,
    JusManagementFilters,
    ManagementActions
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
  methods: {
    getDisputes () {
      this.loadingDisputes = true
      this.$store.dispatch('getDisputes', { query: { bool: {} }, from: 0, size: 3000, order_by: 'favorite DESC' })
        .catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.loadingDisputes = false
        })
    },
    applyFilters () {
      if (this.activeFilters.hasOwnProperty('disputedealvalue') && this.activeFilters.disputedealvalue === 0) {
        delete this.activeFilters['disputedealvalue']
      }
      this.$store.commit('setDisputeFilter', this.activeFilters)
      this.showFilters = false
      window.analytics.track('Filtro aplicado', {
        filters: this.filters,
        tab: this.activeTab.label ? this.activeTab.label : this.activeTab.label = 'Engajamento'
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
      this.$store.dispatch('exportDisputes', this.disputes.map(d => d.id)).then(response => {
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
    clearFilters () {
      this.showFilters = false
      this.$store.commit('clearDisputeFilters')
    },
    restoreFilters () {
      this.activeFilters = JSON.parse(JSON.stringify(this.filters.terms))
    },
    setFavorite (action, id, tab) {
      let label = action === 'favorite' ? 'favoritada' : 'removida de favoritos'
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
          message: 'Disputa ' + label + ' com sucesso.',
          type: 'success'
        })
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      })
    },
    openNewTab (disputeId) {
      let routeData = this.$router.resolve({ name: 'dispute', params: { id: disputeId } })
      window.open(routeData.href, '_blank')
    },
    sortExpirationDate (a, b) {
      if (this.$moment(a.disputeexpirationdate).isAfter(b.disputeexpirationdate)) return 1
      if (this.$moment(a.disputeexpirationdate).isBefore(b.disputeexpirationdate)) return -1
      return 0
    },
    sortLastInteractionDate (a, b) {
      if (this.$moment(a.lastinteractiondate).isAfter(b.lastinteractiondate)) return 1
      if (this.$moment(a.lastinteractiondate).isBefore(b.lastinteractiondate)) return -1
      return 0
    },
    sortDisputeDealDate (a, b) {
      if (this.$moment(a.disputedealdate).isAfter(b.disputedealdate)) return 1
      if (this.$moment(a.disputedealdate).isBefore(b.disputedealdate)) return -1
      return 0
    },
    getLastInteraction (lastinteractiondate) {
      let date = this.$moment(lastinteractiondate)
      if (date.isValid()) {
        let now = this.$moment()
        if (now.diff(date, 'seconds') < 59) {
          return now.diff(date, 'seconds') + ' segundos'
        } else if (now.diff(date, 'minutes') < 59) {
          return now.diff(date, 'minutes') + ' minuto(s)'
        } else if (now.diff(date, 'hours') < 24) {
          return now.diff(date, 'hours') + ' hora(s)'
        } else if (now.diff(date, 'hours') < 48) {
          return '1 dia'
        } else {
          return date.format('DD/MM/YY')
        }
      }
      return ''
    },
    getLastInteractionIcon (type) {
      switch (type) {
        case 'EMAIL_CNA':
          return 'cna'
        case 'EMAIL':
          return 'email'
        case 'WHATSAPP':
          return 'whatsapp'
        case 'SMS':
          return 'sms'
        case 'TTS':
          return 'tts'
        default:
          return 'chat'
      }
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
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  &__row-actions {
    img {
      width: 20px;
      vertical-align: middle;
    }
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      :last-child {
        margin-left: 1px;
      }
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
