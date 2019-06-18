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
        :tab-label="activeTabLabel"
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
          Exportar casos
        </el-button>
      </div>
      <el-tabs
        :key="tabKey"
        :before-leave="handleChangeTab"
        v-model="activeTab"
        class="view-management__tabs">
        <el-tab-pane name="0" label="Engajamento" />
        <el-tab-pane name="1" label="Com Interação" />
        <el-tab-pane name="2" label="Novos Acordos" />
        <el-tab-pane name="3" label="Todos" />
      </el-tabs>
      <el-table
        v-loading="loadingDisputes"
        ref="disputeTable"
        :key="tableKey"
        :data="disputes"
        size="mini"
        class="el-table--disputes"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            teste
          </template>
        </el-table-column> -->
        <el-table-column label="Campanha">
          <template slot-scope="scope">{{ scope.row.campaignname }}</template>
        </el-table-column>
        <el-table-column
          label="Parte(s) contrária(s)">
          <template slot-scope="scope">
            <div v-for="(claimant, index) in scope.row.claiments" slot="reference" :key="claimant + index">
              {{ claimant.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="activeTab !== '3'"
          label="Advogado(s) da parte">
          <template slot-scope="scope">
            <div v-for="(lawyer, index) in scope.row.claimentslawyer" slot="reference" :key="lawyer + index">
              {{ lawyer.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab !== '3'" label="Alçada máxima">
          <template slot-scope="scope">{{ scope.row.disputeupperrange | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab === '0'" label="Valor proposto">
          <template slot-scope="scope">{{ scope.row.disputelastrespondentoffer | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab === '1'" label="Contraproposta">
          <template slot-scope="scope">{{ scope.row.lastoffervalue | currency }}</template>
        </el-table-column>
        <el-table-column
          v-if="activeTab < 2"
          :sort-method="sortExpirationDate"
          sortable
          prop="disputeexpirationdate"
          label="Fim da negociação">
          <template slot-scope="scope">{{ scope.row.disputeexpirationdate | moment('DD/MM/YY') }}</template>
        </el-table-column>
        <el-table-column
          v-if="activeTab === '1'"
          :sort-method="sortLastInteractionDate"
          sortable
          prop="lastinteractiondate"
          label="Última interação">
          <template slot-scope="scope">
            <jus-icon :icon="getLastInteractionIcon(scope.row.lastinteractiontype)" style="vertical-align: text-top; margin-right: 4px;" />
            {{ getLastInteraction(scope.row.lastinteractiondate) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab === '2'" label="Valor do acordo">
          <template slot-scope="scope">{{ scope.row.disputedealvalue | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab === '3'" label="Status">
          <template slot-scope="scope">
            {{ $t('occurrence.type.' + scope.row.disputestatus) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab === '0'" label="Msgs enviadas">
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
          width="70px"
          class-name="view-management__row-actions"
          align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
              <el-button
                type="text"
                class="favorite"
                @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeid, 'ENGAJAMENTO')">
                <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Visualizar caso">
              <router-link :to="{ name: 'dispute', params: { id: scope.row.disputeid } }">
                <jus-icon icon="open-case" />
              </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <template v-if="!$store.state.loading" slot="empty">
          <jus-icon icon="empty-screen-filter" class="view-management__empty-table"/>
          <h4 style="font-weight: normal; line-height: initial;">
            Não foram encontrados casos para<br>os filtros e aba selecionados.
          </h4>
        </template>
      </el-table>
      <el-dialog :visible.sync="showFilters" @open="restoreFilters()">
        <template slot="title">
          <h2>Filtrar {{ activeTabLabel }}</h2>
        </template>
        <jus-management-filters
          :tab-index="activeTab"
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
      tableKey: 0,
      tabKey: false,
      showFilters: false,
      selectedIds: [],
      activeFilters: {},
      activeTab: '0',
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
    },
    activeTabLabel () {
      switch (this.activeTab) {
        case '0':
          return 'Engajamento'
        case '1':
          return 'Com Interação'
        case '2':
          return 'Novos Acordos'
        case '3':
          return 'Todos'
      }
    }
  },
  beforeMount () {
    if (!this.$store.getters.campaignList.length) {
      this.$store.dispatch('getCampaigns')
    }
    if (!this.$store.getters.strategyList) {
      this.$store.dispatch('getStrategies')
    }
  },
  mounted () {
    this.$refs.disputeTable.sort('disputeexpirationdate', 'descending')
    setTimeout(function () {
      this.tabKey = true
    }.bind(this), 500)
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
        this.activeTab = newTab
      }
      this.$refs.disputeTable.clearSort()
      this.tableKey = this.tableKey + 1
      switch (newTab) {
        case '0':
          setTimeout(function () {
            this.$refs.disputeTable.sort('disputeexpirationdate', 'descending')
          }.bind(this), 100)
          break
        case '1':
          setTimeout(function () {
            this.$refs.disputeTable.sort('lastinteractiondate', 'ascending')
          }.bind(this), 100)
          break
        default:
          this.$refs.disputeTable.clearSort()
          break
      }
    },
    exportDisputes () {
      this.loadingExport = true
      this.$store.dispatch('exportDisputes', this.disputes.map(d => d.id)).then(response => {
        // eslint-disable-next-line
        window.open('/api/export/' + response)
        window.analytics.track('Planilha de "' + this.activeTabLabel + '" exportada')
      }).finally(() => {
        this.loadingExport = false
      })
    },
    clearSelection () {
      this.$refs.disputeTable.clearSelection()
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
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      })
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
    getLastInteraction (lastinteractiondate) {
      let date = this.$moment(lastinteractiondate)
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
  .jus-main-view__main-card > .el-card__body {
    position: relative;
    height: 100%;
    // padding: 20px 0;
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
