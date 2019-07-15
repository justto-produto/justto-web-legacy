<template>
  <JusViewMain :loading-main="$store.state.loading" class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
      <management-carousel v-if="!$store.state.loading" />
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
          Exportar disputas
        </el-button>
      </div>
      <el-tabs
        ref="disputeTabs"
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
        ref="disputeTable"
        :key="tableKey"
        :data="paginatedDisputes"
        size="mini"
        class="el-table--disputes"
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40px" />
        <el-table-column type="expand" width="40px">
          <template slot-scope="props">
            <div>
              <h4>
                Processo: {{ props.row.disputecode }}
              </h4>
              <el-row>
                <el-col :span="8">
                  <div>Estratégia: {{ props.row.strategyname }}</div>
                  <div>Status: <span>{{ $t('occurrence.type.' + props.row.disputestatus) | capitalize }}</span></div>
                  <div v-for="(claiment, index) in props.row.claiments" :key="props.row.disputeid + claiment.name + index + 'claimant'">
                    Parte contrária: {{ claiment.name }}
                  </div>
                  <div v-for="(lawyer, index) in props.row.claimentslawyer" :key="props.row.disputeid + lawyer.name + index + 'lawyer'">
                    Advogado: {{ lawyer.name }}
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>Campanha: {{ props.row.campaignname }}</div>
                  <div>Fim da negociação: {{ props.row.disputeexpirationdate | moment('DD/MM/YY') }}</div>
                  <div>Data do acordo: {{ props.row.disputedealdate | moment('DD/MM/YY') }}</div>
                  <div>
                    Última interação:
                    {{ getLastInteraction(props.row.lastinteractiondate) }}
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>Alçada máxima: {{ props.row.disputeupperrange | currency }}</div>
                  <div>Valor proposto: {{ props.row.lastoffervalue | currency }}</div>
                  <div>Contraproposta: {{ props.row.lastcounteroffervalue | currency }}</div>
                  <div>Valor do acordo: {{ props.row.disputedealvalue | currency }}</div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Disputa" min-width="70px">
          <template slot-scope="scope">#{{ scope.row.disputeid }}</template>
        </el-table-column>
        <el-table-column label="Campanha" min-width="90px">
          <template slot-scope="scope">{{ scope.row.campaignname | capitalize }}</template>
        </el-table-column>
        <el-table-column min-width="140px" class-name="text-ellipsis" label="Parte(s) contrária(s)">
          <template slot-scope="scope">
            <div v-if="scope.row.claiments && scope.row.claiments.length > 0">
              {{ scope.row.claiments[0].name }}
            </div>
            <span v-if="scope.row.claiments && scope.row.claiments.length > 1">
              &nbsp;(+{{ scope.row.claiments.length - 1 }})
            </span>
          </template>
        </el-table-column>
        <el-table-column class-name="text-ellipsis" label="Advogado(s) da parte" min-width="152px">
          <template slot-scope="scope">
            <div v-if="scope.row.claimentslawyer && scope.row.claimentslawyer.length > 0">
              {{ scope.row.claimentslawyer[0].name }}
            </div>
            <span v-if="scope.row.claimentslawyer && scope.row.claimentslawyer.length > 1">
              &nbsp;(+{{ scope.row.claimentslawyer.length - 1 }})
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab !== '3'" label="Alçada máxima" align="center" min-width="116px">
          <template slot-scope="scope">{{ scope.row.disputeupperrange | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab === '0'" label="Valor proposto" align="center" min-width="110px">
          <template slot-scope="scope">{{ scope.row.lastoffervalue | currency }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab === '1'" label="Contraproposta" align="center" min-width="116px">
          <template slot-scope="scope">{{ scope.row.lastcounteroffervalue | currency }}</template>
        </el-table-column>
        <el-table-column
          v-if="activeTab < 2"
          sortable="custom"
          prop="disputeexpirationdate"
          label="Fim da negociação"
          align="center"
          min-width="160px">
          <template slot-scope="scope">{{ scope.row.disputeexpirationdate | moment('DD/MM/YY') }}</template>
        </el-table-column>
        <el-table-column
          v-if="activeTab === '1'"
          sortable="custom"
          prop="lastinteractiondate"
          label="Última interação"
          min-width="146px"
          align="center">
          <template slot-scope="scope">
            <el-tooltip :content="getLastInteractionTooltip(scope.row.lastinteractiontype)">
              <jus-icon :icon="getLastInteractionIcon(scope.row.lastinteractiontype)" class="view-management__interaction-icon" />
            </el-tooltip>
            {{ getLastInteraction(scope.row.lastinteractiondate) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab === '2'" label="Valor do acordo" align="center" width="116px">
          <template slot-scope="scope">{{ scope.row.disputedealvalue | currency }}</template>
        </el-table-column>
        <el-table-column
          v-if="activeTab === '2'"
          sortable="custom"
          prop="disputedealdate"
          label="Data do acordo"
          min-width="138px"
          align="center">
          <template slot-scope="scope">{{ scope.row.disputedealdate | moment('DD/MM/YY') }}</template>
        </el-table-column>
        <el-table-column v-if="activeTab === '3'" label="Status" align="center" min-width="110px">
          <template slot-scope="scope">
            {{ $t('occurrence.type.' + scope.row.disputestatus) | capitalize }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab === '0'" label="Msgs enviadas" align="center" min-width="110px">
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
          width="70px"
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
            <el-tooltip content="Abrir disputa em uma nova aba">
              <el-button
                type="text"
                @click="openNewTab(scope.row.disputeid)">
                <jus-icon icon="external-link" />
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
      <div v-if="disputesLength > initialDisputesPerPage" class="view-management__pagination-container">
        <el-pagination
          :total.sync="disputesLength"
          :page-size.sync="disputesPerPage"
          :current-page.sync="currentPage"
          :pager-count="15"
          :page-sizes="[20, 30, 50, 100]"
          layout="total, prev, pager, next, sizes"
          @size-change="handleChangePagination"
          @current-change="handleChangePagination" />
      </div>
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
      currentPage: 1,
      disputesPerPage: 20,
      initialDisputesPerPage: 20
    }
  },
  computed: {
    multiActive () {
      return this.selectedIds.length >= 1
    },
    disputes () {
      return this.$store.getters.filteredDisputes
    },
    disputesLength () {
      return this.disputes.length
    },
    paginatedDisputes () {
      let index = (this.currentPage - 1) * this.disputesPerPage
      return this.disputes.slice(index, index + this.disputesPerPage)
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
  beforeCreate () {
    this.$store.commit('setDisputeTab', '0')
  },
  mounted () {
    this.$refs.disputeTable.sort('disputeexpirationdate', 'descending')
    setTimeout(function () {
      this.tabKey = true
    }.bind(this), 500)
  },
  methods: {
    getDisputes () {
      this.$store.commit('showLoading')
      this.$store.dispatch('getDisputes', { query: { bool: {} }, from: 0, size: 3000, order_by: 'favorite DESC' })
        .catch(() => {
          this.$jusNotification({ type: 'error' })
        })
        .finally(() => {
          this.$store.commit('hideLoading')
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
        tab: this.activeTabLabel
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
    handleRowClick (row, column, event) {
      if (row.disputeid && event.target.tagName !== 'IMG') {
        this.$router.push({ name: 'dispute', params: { id: row.disputeid } })
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
        case '2':
          setTimeout(function () {
            this.$refs.disputeTable.sort('disputedealdate', 'descending')
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
      this.currentPage = 1
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
    handleSortChange (sort) {
      this.$store.commit('setDisputeSort', sort)
    },
    getLastInteraction (lastinteractiondate) {
      let date = this.$moment(lastinteractiondate)
      if (date.isValid()) {
        let now = this.$moment()
        if (now.diff(date, 'seconds') < 0) {
          return ''
        } else if (now.diff(date, 'seconds') < 59) {
          return now.diff(date, 'seconds') + ' há segundos'
        } else if (now.diff(date, 'minutes') < 59) {
          return now.diff(date, 'minutes') + ' há minuto(s)'
        } else if (now.diff(date, 'hours') < 24) {
          return now.diff(date, 'hours') + ' há hora(s)'
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
        case 'NEGOTIATION':
          return 'negotiation2'
        default:
          return 'chat'
      }
    },
    getLastInteractionTooltip (type) {
      switch (type) {
        case 'EMAIL_CNA':
          return 'Última interação via CNA'
        case 'EMAIL':
          return 'Última interação via E-mail'
        case 'WHATSAPP':
          return 'Última interação via WhatsApp'
        case 'SMS':
          return 'Última interação via SMS'
        case 'TTS':
          return 'Última interação via WhatsApp'
        case 'NEGOTIATION':
          return 'Última interação via Sistema Justto'
        default:
          return ''
      }
    },
    handleChangePagination () {
      this.$nextTick(() => {
        this.$el.querySelector('#main-card').scrollTop = 0
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
      margin: 0 0 25px;
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
  &__pagination-container {
    text-align: center;
    .el-pagination {
      margin: 20px 0;
    }
  }
  &__interaction-icon {
    vertical-align: text-top;
    margin-right: 4px;
    max-height: 16px;
  }
}
</style>
