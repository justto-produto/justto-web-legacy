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
        :before-leave="handleChangeTab"
        v-model="activeTab"
        class="view-management__tabs">
        <el-tab-pane name="0">
          <span slot="label">
            Sem resposta
            <el-tooltip content="Disputas que a negociação encerra nos próximos 3 dias">
              <el-badge
                :hidden="!engagementLength"
                :value="engagementLength"
                :max="99"
                class="el-badge--absolute" />
            </el-tooltip>
          </span>
        </el-tab-pane>
        <el-tab-pane name="1">
          <span slot="label">
            Em negociação
            <el-tooltip content="Disputas com novas interações">
              <el-badge
                :hidden="!interactionLength"
                :value="interactionLength"
                :max="99"
                class="el-badge--absolute" />
            </el-tooltip>
          </span>
        </el-tab-pane>
        <el-tab-pane name="2" label="Com Interação">
          <span slot="label">
            Proposta aceita
            <el-tooltip content="Disputas com novas interações">
              <el-badge
                :hidden="!newDealsLength"
                :value="newDealsLength"
                :max="99"
                class="el-badge--absolute" />
            </el-tooltip>
          </span>
        </el-tab-pane>
        <el-tab-pane name="3" label="Com Interação">
          <span slot="label">Todos</span>
        </el-tab-pane>
      </el-tabs>
      <div class="view-management__actions">
        <jus-filter-button />
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
          :height="tableHeigth"
          :data="paginatedDisputes"
          :row-class-name="tableRowClassName"
          size="mini"
          class="el-table--disputes"
          data-testid="dispute-index"
          @row-click="handleRowClick"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40px" />
          <el-table-column type="expand" width="40px">
            <template slot-scope="props">
              <jus-dispute-resume :dispute="props.row" />
            </template>
          </el-table-column>
          <el-table-column
            label="Disputa"
            min-width="94px"
            prop="id"
            sortable="custom">
            <template slot-scope="scope">#{{ scope.row.id }}</template>
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
            v-if="['1', '2'].includes(activeTab)"
            sortable="custom"
            prop="lastInteractionDate"
            label="Última interação"
            min-width="148px"
            align="center">
            <template slot-scope="scope">
              <span class="position-relative">
                <el-tooltip :content="scope.row.lastInteractionTooltip">
                  <jus-icon :icon="scope.row.lastInteractionIcon" class="view-management__interaction-icon" />
                </el-tooltip>
                <i v-if="!scope.row.visualized" class="view-management__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary" />
              </span>
              <span style="margin-left: 4px;">
                {{ scope.row.lastInteractionFormatedDate }}
              </span>
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
              <el-tooltip content="Negociação encerra nos próximos 3 dias">
                <!-- <jus-icon v-if="disputeNextToExpire(scope.row.expirationDate)" icon="alert-active" /> -->
                <i v-if="activeTab === '0'" class="view-management__expiration-pulse el-icon-warning el-icon-pulse el-icon-primary" />
              </el-tooltip>
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
            prop="disputeDealDate"
            label="Data do acordo"
            min-width="138px"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.disputeDealDate | moment('DD/MM/YY') }}
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
          <el-table-column
            width="70px"
            class-name="view-management__row-actions"
            align="center">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
                <el-button
                  type="text"
                  @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.id, 'ENGAJAMENTO')">
                  <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="Abrir disputa em uma nova aba">
                <el-button
                  type="text"
                  @click="openNewTab(scope.row.id)">
                  <jus-icon icon="external-link" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <template v-if="!$store.state.loading" slot="empty">
            <span>
              <jus-icon icon="empty-screen-filter" class="view-management__empty-table" data-testid="cases-empty-icon"/>
              <h4 data-testid="cases-empty-text">
                Não foram encontradas disputas para<br>os filtros selecionados.
              </h4>
            </span>
            <!-- <span v-else>
              <img src="@/assets/loading2.svg" data-testid="cases-empty-icon">
              <h4 data-testid="cases-empty-text">
                Aguardando por novas disputas.
              </h4>
            </span> -->
          </template>
        </el-table>
      </div>
      <div class="view-management__pagination-container">
        <el-pagination
          :total.sync="disputesLength"
          :page-size.sync="disputesPerPage"
          :current-page.sync="currentPage"
          :pager-count="15"
          :page-sizes="[initialDisputesPerPage, 30, 50, 100]"
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
      showFilters: false,
      selectedIds: [],
      activeFilters: {},
      loadingExport: false,
      currentPage: 1,
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
    },
    disputesPerPage: {
      get () {
        return this.$store.getters.disputesPerPage
      },
      set (disputesPerPage) {
        return this.$store.commit('setDisputesPerPage', disputesPerPage)
      }
    },
    engagementLength () {
      return this.$store.getters.disputes.filter(d => {
        return d.tab === 'ENGAGEMENT' && this.disputeNextToExpire(d.expirationDate)
      }).length
    },
    interactionLength () {
      return this.$store.getters.disputes.filter(d => {
        const personId = this.$store.getters.filterPersonId
        if (personId) {
          return d.tab === 'INTERACTION' && !d.visualized && d.negotiators.findIndex(n => n.id === personId) !== -1
        }
        return d.tab === 'INTERACTION' && !d.visualized
      }).length
    },
    newDealsLength () {
      return this.$store.getters.disputes.filter(d => {
        const personId = this.$store.getters.filterPersonId
        if (personId) {
          return d.tab === 'NEWDEALS' && !d.visualized && d.negotiators.findIndex(n => n.id === personId) !== -1
        }
        return d.tab === 'NEWDEALS' && !d.visualized
      }).length
    }
  },
  beforeCreate () {
    if (!this.$store.getters.disputeInitialLoad) {
      this.$store.commit('showLoading')
      this.$store.dispatch('loadDisputes').finally(() => {
        setTimeout(() => {
          this.$store.commit('hideLoading')
        }, 1200)
      })
    }
  },
  beforeMount () {
    setTimeout(() => {
      this.adjustHeight()
    }, 1000)
    window.addEventListener('resize', this.adjustHeight)
  },
  beforeUpdate () {
    this.adjustHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.adjustHeight)
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (!row.visualized && ['1', '2'].includes(this.activeTab)) {
        return 'el-table__row--visualized-row'
      }
    },
    adjustHeight () {
      this.tableHeigth = this.$refs.tableContainer.clientHeight
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
      if (row.id && event.target.tagName !== 'IMG') {
        this.$router.push({ name: 'dispute', params: { id: row.id } })
      }
    },
    updateTable () {
      setTimeout(() => {
        if (this.$refs.disputeTable) this.$refs.disputeTable.doLayout()
      }, 1000)
    },
    handleChangeTab (newTab, oldTab) {
      if (oldTab !== undefined) {
        this.clearSelection()
        this.clearFilters()
      }
      switch (newTab) {
        case '0':
          setTimeout(() => {
            this.doSort('expirationDate', 'descending')
          }, 500)
          break
        case '1':
          setTimeout(() => {
            this.doSort('lastInteractionDate', 'ascending')
          }, 500)
          break
        case '2':
          setTimeout(() => {
            this.doSort('disputeDealDate', 'descending')
          }, 500)
          break
        default:
          this.doSort()
          break
      }
      this.updateTable()
    },
    doSort (direction, prop) {
      if (this.$refs.disputeTable) {
        if (direction && prop) {
          this.$refs.disputeTable.sort(direction, prop)
        } else {
          this.$refs.disputeTable.clearSort()
        }
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
    disputeNextToExpire (dateTime) {
      return this.$moment(dateTime).isBetween(this.$moment(), this.$moment().add(3, 'day'))
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
    handleChangePagination () {
      this.$nextTick(() => {
        let main = this.$el.querySelector('.el-table__body-wrapper')
        main.scrollTop = 0
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

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
      color: $--color-text-secondary;
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
    background-color: $--color-white;
    z-index: 2;
    padding-top: 20px;
    border-radius: 5px 5px 0 0;
    .el-tabs__header {
      width: fit-content;
      padding: 0 20px;
      margin: 0px 0 20px;
    }
    .el-tabs__item {
      &:hover .el-badge__content {
        // background-color: $--color-primary;
        background-color: $--color-primary-light-7;
      }
      .el-badge__content {
        // background-color: $--color-primary-light-7;
        background-color: rgb(220, 223, 230);
      }
      &.is-active {
        .el-badge__content {
          background-color: $--color-primary;
        }
      }
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
  &:not(.view-management-review) {
    .jus-main-view__main-card {
      > .el-card__body {
        padding-top: 80px;
        height: 100%;
      }
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
  &__interaction-pulse {
    position: absolute;
    font-size: 16px;
    bottom: -5px;
    right: -3px;
  }
  &__expiration-pulse {
    vertical-align: sub;
  }
}
</style>
