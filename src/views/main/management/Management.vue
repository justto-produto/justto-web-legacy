<template>
  <JusViewMain :loading-main="$store.state.loading" class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
      <management-carousel />
    </template>
    <template slot="actions">
      <management-actions
        :active="multiActive"
        :selected-ids="selectedIds"
        :tab-label="activeTabLabel"
        @disputes:clear="clearSelection"/>
      <el-tabs
        ref="disputeTabs"
        :key="tabKey"
        :before-leave="handleChangeTab"
        v-model="activeTab"
        class="view-management__tabs">
        <el-tab-pane name="0" label="Engajamento"/>
        <el-tab-pane name="1" label="Com Interação"/>
        <el-tab-pane name="2" label="Novos Acordos"/>
        <el-tab-pane name="3" label="Todos"/>
      </el-tabs>
      <div class="view-management__actions">
        <jus-filter-button />
        <el-button
          icon="el-icon-refresh"
          plain
          data-testid="update-cases"
          @click="getDisputes()">
          Atualizar
        </el-button>
        <el-button
          :plain="!Object.keys(filters.terms).length"
          :type="Object.keys(filters.terms).length ? 'primary' : ''"
          @click="showFilters = true">
          <jus-icon :is-white="!!Object.keys(filters.terms).length" icon="filter" data-testid="management-filterbtn" />
          Filtrar
        </el-button>
        <el-button
          :loading="loadingExport"
          :disabled="disputes.length === 0"
          plain
          icon="el-icon-download"
          data-testid="export-disputes"
          @click="exportDisputes">
          Exportar disputas
        </el-button>
      </div>
    </template>
    <template slot="main">
      <div ref="tableContainer" class="view-management__table-container">
        <el-table
          ref="disputeTable"
          :key="tableKey"
          :max-height="tableHeigth"
          :data="paginatedDisputes"
          :row-class-name="handleRowClassName"
          size="mini"
          class="el-table--disputes"
          data-testid="dispute-index"
          @row-click="handleRowClick"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40px" />
          <el-table-column type="expand" width="40px">
            <template slot-scope="props">
              <!-- <jus-dispute-resume :dispute="props.row" /> -->
            </template>
          </el-table-column>
          <el-table-column
            label="Disputa"
            min-width="94px"
            prop="disputeId"
            sortable="custom">
            <template slot-scope="scope">#{{ scope.row.disputeId }}</template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="campaignName"
            label="Campanha"
            min-width="114px">
            <template slot-scope="scope">{{ scope.row.campaignName | capitalize }}</template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="firstClaimant"
            min-width="164px"
            class-name="text-ellipsis"
            label="Parte(s) contrária(s)">
            <template slot-scope="scope">
              {{ scope.row.firstClaimant }}
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="firstClaimantLawyer"
            class-name="text-ellipsis"
            label="Advogado(s) da parte"
            min-width="176px">
            <template slot-scope="scope">
              {{ scope.row.firstClaimantLawyer }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab !== '3'"
            label="Alçada máxima"
            align="center"
            sortable="custom"
            prop="disputeUpperRange"
            min-width="140px">
            <template slot-scope="scope">
              {{ scope.row.disputeUpperRange | currency }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab === '0'"
            label="Valor proposto"
            sortable="custom"
            prop="lastOfferValue"
            align="center"
            min-width="134px">
            <template slot-scope="scope">
              {{ scope.row.lastOfferValue | currency }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab === '1'"
            label="Contraproposta"
            align="center"
            sortable="custom"
            prop="lastCounterOfferValue"
            min-width="140px">
            <template slot-scope="scope">
              {{ scope.row.lastCounterOfferValue | currency }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab < 2"
            sortable="custom"
            prop="expirationDate"
            label="Fim da negociação"
            align="center"
            min-width="160px">
            <template slot-scope="scope">
              {{ scope.row.expirationDate | moment('DD/MM/YY') }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab === '1'"
            sortable="custom"
            prop="lastInteractionDate"
            label="Última interação"
            min-width="146px"
            align="center">
            <template slot-scope="scope">
              <el-tooltip :content="getLastInteractionTooltip(scope.row.lastInteractionType)">
                <jus-icon :icon="getLastInteractionIcon(scope.row.lastInteractionType)" class="view-management__interaction-icon" />
              </el-tooltip>
              {{ getLastInteraction(scope.row.lastInteractionDate) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab === '2'"
            label="Valor do acordo"
            sortable="custom"
            prop="disputeDealValue"
            align="center"
            width="140px">
            <template slot-scope="scope">{{ scope.row.disputeDealValue | currency }}</template>
          </el-table-column>
          <el-table-column
            v-if="activeTab === '2'"
            sortable="custom"
            prop="conclusionDate"
            label="Data do acordo"
            min-width="138px"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.conclusionDate | moment('DD/MM/YY') }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab === '3'"
            label="Status"
            sortable="custom"
            prop="status"
            align="center"
            min-width="110px">
            <template slot-scope="scope">
              {{ $t('occurrence.type.' + scope.row.status) | capitalize }}
            </template>
          </el-table-column>
          <el-table-column v-if="activeTab === '0'" label="Msgs enviadas" align="center" min-width="110px">
            <template slot-scope="scope">
              <span v-if="!scope.row.communicationMsgTotalsShedulled">
                Enriquecendo
              </span>
              <span v-else>
                {{ scope.row.communicationMsgTotalSent }} /
                {{ scope.row.communicationMsgTotalsShedulled }}
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
                  @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.disputeId, 'ENGAJAMENTO')">
                  <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="Abrir disputa em uma nova aba">
                <el-button
                  type="text"
                  @click="openNewTab(scope.row.disputeId)">
                  <jus-icon icon="external-link" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <template v-if="!$store.state.loading" slot="empty">
            <jus-icon icon="empty-screen-filter" class="view-management__empty-table" data-testid="cases-empty-icon"/>
            <h4 style="font-weight: normal; line-height: initial;" data-testid="cases-empty-text">
              Não foram encontradas disputas para<br>os filtros e aba selecionados.
            </h4>
          </template>
        </el-table>
      </div>
      <div v-if="disputesLength > initialDisputesPerPage" class="view-management__pagination-container">
        <el-pagination
          :total.sync="disputesLength"
          :page-size.sync="disputesPerPage"
          :current-page.sync="currentPage"
          :pager-count="15"
          :page-sizes="[disputesPerPage, 30, 50, 100]"
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
            data-testid="filter-applyfilter"
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
import JusFilterButton from '@/components/buttons/JusFilterButton'
import ManagementCarousel from './partials/ManagementCarousel'
import ManagementActions from './partials/ManagementActions'
import JusDisputeResume from '@/components/layouts/JusDisputeResume'

export default {
  name: 'Management',
  components: {
    ManagementCarousel,
    JusManagementFilters,
    ManagementActions,
    JusFilterButton,
    JusDisputeResume
  },
  data () {
    return {
      tableKey: 0,
      tabKey: false,
      showFilters: false,
      selectedIds: [],
      activeFilters: {},
      loadingExport: false,
      currentPage: 1,
      disputesPerPage: 20,
      initialDisputesPerPage: 20,
      tableHeigth: 0
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.$store.getters.disputeActiveTab
      },
      set (tab) {
        this.$store.commit('setDisputeTab', tab)
      }
    },
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
  mounted () {
    this.$nextTick(() => {
      this.tabKey = true
      this.adjustHeight()
      window.addEventListener('resize', this.adjustHeight)
    })
    setTimeout(function () {
      this.tabKey = true
      this.tableHeigth = this.$refs.tableContainer.clientHeight
    }.bind(this), 500)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.adjustHeight)
  },
  methods: {
    adjustHeight() {
      this.tableHeigth = this.$refs.tableContainer.clientHeight
    },
    getDisputes () {
      this.$store.commit('showLoading')
      this.$store.dispatch('getDisputes')
        .catch(() => {
          this.$jusNotification({ type: 'error' })
        })
        .finally(() => {
          this.$store.commit('hideLoading')
        })
    },
    applyFilters () {
      if (this.activeFilters.hasOwnProperty('disputeDealValue') && this.activeFilters.disputedealvalue === 0) {
        delete this.activeFilters['disputeDealValue']
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
        if (dispute && dispute.id) {
          this.selectedIds.push(dispute.id)
        }
      }
    },
    handleRowClick (row, column, event) {
      if (row.disputeId && event.target.tagName !== 'IMG') {
        this.$router.push({ name: 'dispute', params: { id: row.disputeId } })
      }
    },
    handleRowClassName (obj) {
      if (this.$store.getters.disputesUpdatingList.includes(obj.row.id)) {
        return 'el-table__row--loading'
      }
    },
    handleChangeTab (newTab, oldTab) {
      if (oldTab !== undefined) {
        this.clearSelection()
        this.clearFilters()
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
            this.$refs.disputeTable.sort('disputeDealDate', 'descending')
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
        // window.open('/api/export/' + response)
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
      if (!lastinteractiondate) return null
      let date = this.$moment(lastinteractiondate + 'Z')
      if (date.isValid()) {
        let now = this.$moment()
        if (now.diff(date, 'seconds') < 0) {
          return ''
        } else if (now.diff(date, 'seconds') < 59) {
          return 'há ' + now.diff(date, 'seconds') + ' segundos'
        } else if (now.diff(date, 'minutes') < 59) {
          return 'há ' + now.diff(date, 'minutes') + ' minuto(s)'
        } else if (now.diff(date, 'hours') < 24) {
          return 'há ' + now.diff(date, 'hours') + ' hora(s)'
        } else if (now.diff(date, 'hours') < 48) {
          return 'há 1 dia'
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
          return ''
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
    position: absolute;
    left: 23px;
    right: 36px;
    top: 21px;
    background-color: #fff;
    z-index: 2;
    padding-top: 20px;
    border-radius: 5px 5px 0 0;
    .el-tabs__header {
      width: fit-content;
      padding: 0 20px;
      margin: 0px 0 20px;
    }
  }
  &__actions {
    display: flex;
    position: absolute;
    z-index: 2;
    top: 40px;
    right: 40px;
    .el-button {
      line-height: 14px;
      padding: 8px 18px;
    }
    img {
      vertical-align: sub;
      width: 14px;
    }
  }
  .jus-main-view__main-card {
    > .el-card__body {
      padding-top: 80px;
      height: 100%;
    }
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
    overflow-x: hidden;
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
  &__table-container {
    height: calc(100% - 52px);
  }
}
</style>
