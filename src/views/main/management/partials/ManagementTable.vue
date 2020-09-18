<template>
  <div class="management-table__container">
    <jus-protocol-dialog
      :protocol-dialog-visible.sync="protocolDialogVisible"
      :dispute-id.sync="selectedDisputeId"
      :dispute-roles.sync="selectedDisputeRoles"
    />
    <el-table
      ref="disputeTable"
      :key="disputeKey"
      v-loading="responseBoxLoading"
      :data.sync="disputes"
      :row-class-name="tableRowClassName"
      :element-loading-text="responseBoxLoading ? 'Enviando mensagem...' : 'Atualizando informações...'"
      size="mini"
      empty-text=" "
      height="100%"
      class="management-table el-table--disputes"
      data-testid="dispute-index"
      @cell-mouse-enter="cellMouseEnter"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="44px"
      />
      <el-table-column
        :sortable="false"
        label="Processo"
        min-width="100px"
        class-name="management-table__row-code"
        prop="code"
      >
        <template slot-scope="scope">
          <dispute-code-link
            :code="scope.row.code"
            @hoverDisputeCode="hoverDisputeCode(scope.row.code)"
            @openTimeline="openTimelineModal(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="campaignName"
        label="Campanha"
        min-width="94px"
      >
        <template
          v-if="scope.row.campaign"
          slot-scope="scope"
        >
          {{ scope.row.campaign.name | capitalize }}
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="firstClaimant"
        min-width="140px"
        class-name="text-ellipsis"
        label="Parte(s) contrária(s)"
      >
        <template slot-scope="scope">
          <jus-vexatious-alert
            v-if="scope.row.firstClaimantAlerts && scope.row.firstClaimantAlerts.length"
            :document-number="scope.row.firstClaimantDocumentNumber"
            :name="scope.row.firstClaimant"
            style="display: flex;"
          />
          {{ scope.row.firstClaimant }}
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="firstClaimantLawyer"
        class-name="text-ellipsis"
        label="Advogado(s) da parte"
        min-width="154px"
      >
        <template slot-scope="scope">
          <jus-vexatious-alert
            v-if="scope.row.firstClaimantLawyerAlerts && scope.row.firstClaimantLawyerAlerts.length"
            :document-number="scope.row.firstClaimantLawyerDocumentNumber"
            :alerts="scope.row.firstClaimantLawyerAlerts"
            style="display: flex;"
          />
          {{ scope.row.firstClaimantLawyer }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab0 || tab1"
        :sortable="false"
        label="Alçada máxima"
        align="center"
        prop="disputeUpperRange"
        min-width="118px"
      >
        <template slot-scope="scope">
          {{ scope.row.disputeUpperRange | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab0"
        :sortable="false"
        label="Valor proposto"
        prop="lastOfferValue"
        align="center"
        min-width="114px"
      >
        <template slot-scope="scope">
          {{ scope.row.lastOfferValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab1 || tab2"
        label="Interações"
        min-width="140px"
        align="center"
      >
        <template slot-scope="scope">
          <ManagementLastInteraction
            :data="scope.row"
            @update:responseBoxLoading="responseBoxLoading = $event"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab2"
        label="Minuta"
        width="110px"
        class-name="management-table__row-actions"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            class="management-table__protocol_button"
            @click="showProtocolModal(scope.row)"
          >
            Minuta
            <div :class="'management-table__protocol_button--step-' + getDocumentStep(scope.row.hasDocument, scope.row.signStatus)">
              <span /><span /><span />
            </div>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab1"
        :sortable="false"
        label="Contraproposta"
        align="center"
        prop="lastCounterOfferValue"
        min-width="120px"
      >
        <template slot-scope="scope">
          {{ scope.row.lastCounterOfferValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab || tab0 || tab1 || tab3"
        :sortable="false"
        prop="expirationDate"
        label="Fim da negociação"
        align="center"
        min-width="140px"
      >
        <template slot-scope="scope">
          <el-tooltip content="Negociação encerra nos próximos 3 dias">
            <span
              v-if="(disputeNextToExpire(scope.row.expirationDate.dateTime) || scope.row.disputeNextToExpire) && scope.row.status !== 'EXPIRED'"
              data-testid="expiration-notify"
              class="management-table__expiration-icon position-relative"
            >
              <jus-icon icon="clock" />
              <i class="management-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary" />
            </span>
          </el-tooltip>
          <span v-if="scope.row.expirationDate">{{ scope.row.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab2"
        :sortable="false"
        label="Valor do acordo"
        prop="disputeDealValue"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          {{ scope.row.disputeDealValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab2"
        :sortable="false"
        prop="disputeDealDate"
        label="Data do acordo"
        min-width="118px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.disputeDealDate">{{ scope.row.disputeDealDate.dateTime | moment('DD/MM/YY') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab1 || tab3"
        :sortable="false"
        label="Status"
        prop="status"
        align="center"
        min-width="90px"
      >
        <template slot-scope="scope">
          {{ $t('occurrence.type.' + scope.row.status) | capitalize }}
          <span v-if="scope.row.paused">(pausada)</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="hidden-actions"
        width="1px"
      >
        <template slot-scope="scope">
          <jus-dispute-actions
            v-if="disputeActionsRow === scope.row.id"
            :dispute="scope.row"
            table-actions
          />
        </template>
      </el-table-column>
      <template slot="empty">
        <transition name="el-fade-in-linear">
          <span v-show="showEmpty">
            <jus-icon
              icon="empty-screen-filter"
              class="management-table__empty-table"
              data-testid="cases-empty-icon"
            />
            <h4 data-testid="cases-empty-text">
              Não foram encontradas disputas para<br>os filtros selecionados.
            </h4>
          </span>
        </transition>
      </template>
      <infinite-loading
        v-if="disputes.length >= 20"
        slot="append"
        :distance="20"
        spinner="spiral"
        force-use-infinite-wrapper=".el-table__body-wrapper"
        @infinite="infiniteHandler"
      >
        <div slot="no-more">
          Fim das disputas
        </div>
        <div slot="no-results">
          Fim das disputas
        </div>
      </infinite-loading>
    </el-table>
    <jus-timeline
      v-if="currentDisputeCode"
      v-model="disputeTimelineModal"
      :code="currentDisputeCode"
    />
  </div>
</template>

<script>
import { getDocumentStep } from '@/utils/jusUtils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ManagementTable',
  components: {
    DisputeCodeLink: () => import('./DisputeCodeLink'),
    ManagementLastInteraction: () => import('./ManagementLastInteraction'),
    JusTimeline: () => import('@/components/JusTimeline/JusTimeline'),
    JusDisputeActions: () => import('@/components/buttons/JusDisputeActions'),
    JusProtocolDialog: () => import('@/components/dialogs/JusProtocolDialog'),
    InfiniteLoading: () => import('vue-infinite-loading'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert'),
  },
  props: {
    activeTab: {
      type: String,
      default: '0',
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    loadingDisputes: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentDisputeCode: null,
      disputeTimelineModal: false,
      showEmpty: false,
      showEmptyDebounce: '',
      disputeActionsRow: 0,
      protocolDialogVisible: false,
      selectedDisputeId: 0,
      selectedDisputeRoles: [],
      disputeKey: 0,
      responseBoxLoading: false,
    }
  },
  computed: {
    ...mapGetters(['disputeTimeline', 'loading']),
    selectedIdsComp: {
      get() {
        return this.selectedIds
      },
      set(ids) {
        this.$emit('update:selectedIds', ids)
      },
    },
    disputes() {
      return this.$store.getters.disputes
    },
    tab() {
      return this.activeTab === '-1'
    },
    tab0() {
      return this.activeTab === '0'
    },
    tab1() {
      return this.activeTab === '1'
    },
    tab2() {
      return this.activeTab === '2'
    },
    tab3() {
      return this.activeTab === '3'
    },
  },
  watch: {
    disputes: {
      handler() {
        this.$refs.disputeTable.doLayout()
      },
      deep: true,
    },
    loadingDisputes(value) {
      if (!value) {
        clearTimeout(this.showEmptyDebounce)
        this.showEmptyDebounce = setTimeout(() => {
          this.showEmpty = true
        }, 2000)
      }
    },
  },
  beforeCreate() {
    this.$store.commit('resetDisputeQueryPage')
  },
  methods: {
    ...mapActions(['getDisputeTimeline']),

    hoverDisputeCode(code) {
      if (!this.disputeTimeline[code]) {
        this.getDisputeTimeline(code)
      }
    },
    openTimelineModal(dispute) {
      const { code } = dispute
      if (!this.disputeTimeline[code] || this.disputeTimeline[code].lawsuits.length === 0) {
        return
      }
      this.currentDisputeCode = code
      this.$nextTick(() => {
        this.disputeTimelineModal = true
      })
      this.$jusSegment('Linha do tempo visualizada pelo gerenciamento', { disputeId: dispute.id })
    },
    cellMouseEnter(row, column, cell, event) {
      this.disputeActionsRow = row.id
    },
    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus),
    tableRowClassName({ row, rowIndex }) {
      if (!row.visualized && !this.tab0) {
        return 'el-table__row--visualized-row'
      }
    },
    handleRowClick(row, column, event) {
      if (row.id && !['IMG', 'SPAN', 'BUTTON', 'I'].includes(event.target.tagName)) {
        this.$router.push({ name: 'dispute', params: { id: row.id } })
      }
    },
    clearSelection() {
      this.$refs.disputeTable.clearSelection()
    },
    handleSelectionChange(selected) {
      const ids = []
      for (const dispute of selected) {
        if (dispute && dispute.id) {
          ids.push(dispute.id)
        }
      }
      this.selectedIdsComp = ids
    },
    disputeNextToExpire(date) {
      return this.$moment(date).isBetween(this.$moment(), this.$moment().add(4, 'day'))
    },
    showProtocolModal(dispute) {
      this.selectedDisputeId = dispute.id
      this.selectedDisputeRoles = dispute.disputeRoles
      this.protocolDialogVisible = true
    },

    infiniteHandler($state) {
      this.$store.commit('addDisputeQueryPage')
      this.$store.dispatch('getDisputes', 'nextPage').then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.management-table__container {
  height: calc(100% - 114px);

  @media (max-height: 680px) {
    height: calc(100% - 93px);
  }
}

.management-table {
  @media (max-height: 680px) {
    margin-bottom: 0;
  }

  th {
    @media (max-height: 680px) {
      padding: 2px 0 4px 0;
      height: 100%;
    }
  }
  &__expiration-icon {
    margin-right: 6px;
    img {
      vertical-align: middle;
      margin-right: 4px;
      max-height: 16px;
      max-width: 16px;
    }
  }
  &__expiration-pulse {
    vertical-align: sub;
  }
  &__row-actions {
    img {
      width: 20px;
      vertical-align: middle;
    }
    .el-button--text {
      margin-left: 6px;
    }
  }
  &__row-info {
    img {
      vertical-align: middle !important;
      width: 22px;
    }
    span + img {
      margin-left: 8px;
      width: 16px;
    }
  }
  &__empty-table {
    margin-top: 40px;
    width: 60px;
  }
  &__protocol_button {
    position: relative;
    div {
      display: flex;
      position: absolute;
      bottom: -1px;
      left: -1px;
      right: -1px;
      span {
        height: 3px;
        border: 1px solid #dcdfe6;
        width: 100%;
        &:first-child {
          border-radius: 0 0 0 1px;
        }
        &:last-child {
          border-radius: 0 0 1px 0;
        }
      }
    }
    &:hover div span {
      border: 1px solid #9461f7;
    }
  }
  &__protocol_button--step {
    &-1 {
      span:first-child {
        background-color: #9461f7;
        border-color: #9461f7;
      }
    }
    &-2 {
      span:first-child, span:nth-child(2) {
        background-color: #9461f7;
        border-color: #9461f7;
      }
    }
    &-3 {
      span {
        background-color: #9461f7;
        border-color: #9461f7;
      }
    }
  }
  .el-table__empty-block {
    width: auto !important;
  }
  th.hidden-actions {
    position: relative;
  }
  td.hidden-actions {
    .cell {
      display: none;
    }
  }
  tr:hover {
    td.hidden-actions .cell{
      display: contents;
    }
  }
  th.gutter {
    display: table-cell !important;
  }
  td {
    height: 46px;
  }
  .infinite-loading-container {
    font-style: italic;
    margin: 20px 0 10px;
    color: #adadad;
    font-size: 1rem;
  }
}
.dialog-timeline {
  .dialog-timeline__title {
    text-align: center;
    padding-top: 20px;
    font: normal normal medium 17px/22px Montserrat;
    letter-spacing: 0px;
    color: #424242;
    font-weight: bold;
  }

  .el-dialog__body {
    margin-top: 0px;
  }
}
</style>
