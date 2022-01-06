<template>
  <div class="management-table__container">
    <jus-protocol-dialog
      :protocol-dialog-visible.sync="protocolDialogVisible"
      :dispute-id.sync="selectedDispute.id"
      :dispute.sync="selectedDispute"
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
      @cell-mouse-leave="cellMouseLeave()"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @header-click="handleHeaderClick"
    >
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
        <template v-slot="scope">
          <DisputeCodeLink
            :code="scope.row.code"
            :custom-style="{ fontWeight: (!scope.row.visualized && !['1'].includes(activeTab))? 'bold' : 'normal'}"
            tj-placement="bottom"
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
          <el-tooltip
            placement="top-start"
            :value="actieTooltipDisputeId === scope.row.id"
            :content="!!lastAccess[scope.row.id] ? lastAccess[scope.row.id].date : 'Ainda não sei quando você acessou esta disputa'"
          >
            <div>
              {{ scope.row.campaign.name | capitalize }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        :sortable="false"
        prop="firstClaimant"
        min-width="140px"
        class-name="text-ellipsis first-claimant-container"
        :label="$tc('fields.claimantParty', isRecoveryStrategy)"
      >
        <template v-slot="scope">
          <div class="first-claimant-container__cell">
            <jus-vexatious-alert
              v-if="(scope.row.firstClaimantAlerts && scope.row.firstClaimantAlerts.length)"
              :document-number="scope.row.firstClaimantDocumentNumber"
              :name="scope.row.firstClaimant"
              style="display: flex; align-items: center;"
            />
            <el-tooltip
              v-if="scope.row.firstClaimant"
              class="online-icon"
              :content="`${$options.filters.capitalize(scope.row.firstClaimant.toLowerCase().split(' ')[0])} está online`"
            >
              <jus-icon
                v-if="onlineDocuments[scope.row.firstClaimantDocumentNumber] === 'ONLINE'"
                icon="online"
                style="height: 8px; width: 8px;"
              />
            </el-tooltip>
            {{ scope.row.firstClaimant || '-' | capitalize }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :sortable="false"
        prop="firstClaimantLawyer"
        class-name="text-ellipsis first-claimant-container"
        :label="$tc('fields.claimantLawyer', isRecoveryStrategy)"
        min-width="154px"
      >
        <template v-slot="scope">
          <div class="first-claimant-container__cell">
            <jus-vexatious-alert
              v-if="scope.row.firstClaimantLawyerAlerts && scope.row.firstClaimantLawyerAlerts.length"
              :document-number="scope.row.firstClaimantLawyerDocumentNumber"
              :alerts="scope.row.firstClaimantLawyerAlerts"
              style="display: flex;"
            />

            <el-tooltip
              v-if="scope.row.firstClaimantLawyer"
              :content="`${$options.filters.capitalize(scope.row.firstClaimantLawyer.toLowerCase().split(' ')[0])} está online`"
            >
              <jus-icon
                v-if="onlineDocuments[scope.row.firstClaimantLawyerDocumentNumber] === 'ONLINE'"
                icon="online"
                style="height: 8px; width: 8px;"
              />
              <jus-icon
                v-else-if="onlineDocuments[scope.row.firstClaimantLawyerOab] === 'ONLINE'"
                icon="online"
                style="height: 8px; width: 8px;"
              />
            </el-tooltip>

            <el-tooltip
              content="Buscar disputas com este advogado"
              :disabled="(scope.row.firstClaimantLawyer || '-') === '-'"
              :open-delay="500"
            >
              <div>
                {{ scope.row.firstClaimantLawyer || '-' | capitalize }}
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab1 || tab2"
        :sortable="false"
        :label="$tc('UPPER_RANGE', isRecoveryStrategy)"
        align="center"
        prop="disputeUpperRange"
        min-width="118px"
      >
        <template v-slot="scope">
          <span v-if="scope.row.disputeUpperRange">
            {{ scope.row.disputeUpperRange | currency }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab1"
        :sortable="false"
        label="Valor proposto"
        prop="lastOfferValue"
        align="center"
        min-width="114px"
      >
        <template v-slot="scope">
          {{ scope.row.lastOfferValue | currency }}
        </template>
      </el-table-column>

      <!-- label="Interações" -->

      <el-table-column
        v-if="tab2 || tab3 || tab4"
        min-width="140px"
        align="center"
        label="Interações"
      >
        <template v-slot:header>
          <div class="is-pointer">
            Interações
            <i
              v-if="sortKeys.includes('lastInboundInteraction.createdAt')"
              :class="{
                'el-icon-caret-top': sortStripped['lastInboundInteraction.createdAt'] === 'asc',
                'el-icon-caret-bottom': sortStripped['lastInboundInteraction.createdAt'] === 'desc'
              }"
            />
          </div>
        </template>

        <template v-slot="scope">
          <ManagementLastInteraction
            :data="scope.row"
            @update:responseBoxLoading="responseBoxLoading = $event"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-if="(tab3 || tab4) && showDraft"
        label="Minuta"
        width="110px"
        class-name="management-table__row-actions"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            v-if="isWonDispute(scope.row.status) || scope.row.hasDocument"
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
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab2"
        :sortable="false"
        :label="isRecoveryStrategy ? 'Proposta do réu' : 'Proposta da parte'"
        align="center"
        prop="lastCounterOfferValue"
        min-width="120px"
      >
        <template v-slot="scope">
          {{ scope.row | counterProposal | currency }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab0"
        :sortable="false"
        label="Motivo"
        prop=""
        min-width="140px"
      >
        <template v-slot="scope">
          <el-tooltip
            v-if="scope.row.properties && scope.row.properties['PALAVRAS PRE NEGOCIACAO'] && scope.row.properties['MOTIVO PRE NEGOCIACAO']"
            :open-delay="600"
            popper-class="management-table__prenegotiation-tooltip"
          >
            <span
              slot="content"
              v-html="scope.row.properties['MOTIVO PRE NEGOCIACAO']"
            />
            <span>
              {{ scope.row.properties['PALAVRAS PRE NEGOCIACAO'].split(',').join(', ').replace(/[\[\]]/gi, '') }}
            </span>
          </el-tooltip>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab0 || tab1 || tab2 || tabAll"
        :sortable="false"
        prop="expirationDate"
        label="Fim da negociação"
        align="center"
        width="136px"
      >
        <template v-slot="scope">
          <el-tooltip content="Negociação encerra nos próximos 3 dias">
            <span
              v-if="((scope.row.expirationDate && disputeNextToExpire(scope.row.expirationDate.dateTime)) || scope.row.disputeNextToExpire) && scope.row.status !== 'EXPIRED'"
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
        v-if="tab1 || tab4 || tabAll"
        :sortable="false"
        label="Status"
        prop="status"
        align="center"
        min-width="90px"
      >
        <template v-slot="scope">
          {{ $t('occurrence.type.' + scope.row.status) | capitalize }}
          <span v-if="scope.row.paused">(pausada)</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab3 || tab4"
        :sortable="false"
        label="Valor do acordo"
        prop="disputeDealValue"
        align="center"
        width="120px"
      >
        <template v-slot="scope">
          <span v-if="scope.row.disputeDealValue && isWonDispute(scope.row.status)">
            {{ scope.row.disputeDealValue | currency }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab3 || tab4 || tabAll"
        :sortable="false"
        prop="disputeDealDate"
        label="Data do acordo"
        min-width="118px"
        align="center"
      >
        <template v-slot="scope">
          <span v-if="scope.row.disputeDealDate && isWonDispute(scope.row.status)">
            {{ scope.row.disputeDealDate.dateTime | moment('DD/MM/YY') }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="hidden-actions"
        width="1px"
      >
        <template v-slot="scope">
          <jus-dispute-actions
            v-if="disputeActionsRow === scope.row.id"
            :dispute="scope.row"
            table-actions
            @open:newtab="addHighlight(scope.row.id)"
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

    <negotiator-activeReply
      v-if="Object.keys(activeDispute).length"
      :visible.sync="canShowDialogReplyEditor"
      :dispute="activeDispute"
    />
  </div>
</template>

<script>
import { getDocumentStep } from '@/utils'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ManagementTable',

  filters: {
    counterProposal: function({ lastCounterOfferValue, disputeUpperRange, lastOfferValue }) {
      if (lastCounterOfferValue) {
        return lastCounterOfferValue
      } else if (!disputeUpperRange && lastOfferValue) {
        return lastOfferValue
      } else {
        return 0
      }
    }
  },

  components: {
    NegotiatorActiveReply: () => import('./partials/NegotiatorActiveReply'),
    DisputeCodeLink: () => import('@/components/buttons/DisputeCodeLink'),
    ManagementLastInteraction: () => import('./ManagementLastInteraction'),
    JusTimeline: () => import('@/components/JusTimeline/JusTimeline'),
    JusDisputeActions: () => import('@/components/buttons/JusDisputeActions'),
    JusProtocolDialog: () => import('@/components/dialogs/JusProtocolDialog'),
    InfiniteLoading: () => import('vue-infinite-loading'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert')
  },

  props: {
    activeTab: {
      type: String,
      default: '2'
    },
    selectedIds: {
      type: Array,
      default: () => []
    },
    loadingDisputes: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentDisputeCode: null,
      disputeTimelineModal: false,
      showEmpty: false,
      showEmptyDebounce: '',
      disputeActionsRow: 0,
      protocolDialogVisible: false,
      selectedDispute: {
        id: 0
      },
      disputeKey: 0,
      responseBoxLoading: false,
      actieTooltipDisputeId: 0,
      activeDisputeIds: [],
      canShowDialogReplyEditor: false,
      activeDispute: {},
      lastAccessTooltipTimeout: () => {}
    }
  },

  computed: {
    ...mapGetters({
      disputeTimeline: 'getDisputesTimeline',
      loading: 'loading',
      disputes: 'disputes',
      lastAccess: 'lastAccess',
      onlineDocuments: 'onlineDocuments',
      showDraft: 'getIsDraftManagementActive',
      isRecoveryStrategy: 'isWorkspaceRecovery',
      sortQuery: 'disputeQuery'
    }),

    selectedIdsComp: {
      get() {
        return this.selectedIds
      },
      set(ids) {
        this.$emit('update:selectedIds', ids)
      }
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

    tab4() {
      return this.activeTab === '4'
    },

    tabAll() {
      return this.activeTab === '9'
    },

    sortStripped() {
      return (this.sortQuery?.sort || []).reduce((acc, cur) => {
        const [key, sort] = cur.split(',')
        const temp = {}

        temp[key] = sort
        return { ...acc, ...temp }
      }, {})
    },

    sortKeys() {
      return Object.keys(this.sortStripped)
    }
  },

  watch: {
    disputes: {
      handler() {
        this.$refs.disputeTable.doLayout()
      },
      deep: true
    },
    loadingDisputes(value) {
      if (!value) {
        clearTimeout(this.showEmptyDebounce)
        this.showEmptyDebounce = setTimeout(() => {
          this.showEmpty = true
        }, 2000)
      }
    },
    canShowDialogReplyEditor() {
      if (!this.canShowDialogReplyEditor) {
        this.activeDispute = {}
      }
    }
  },

  beforeCreate() {
    this.$store.commit('resetDisputeQueryPage')
    this.$store.dispatch('cleanDisputeLastAccess')
  },

  beforeMount() {
    this.clearHighlight()
  },

  methods: {
    ...mapActions([
      'getDisputes',
      'getDisputeTimeline',
      'getDisputeLastAccess',
      'cleanDisputeLastAccess'
    ]),

    ...mapMutations(['updateDisputeQuery']),

    openActiveMessageModal(dispute) {
      this.activeDispute = dispute
      this.canShowDialogReplyEditor = true
    },

    addHighlight(id) {
      this.activeDisputeIds.push(id)
    },

    clearHighlight() {
      this.activeDisputeIds = []
    },

    isWonDispute(disputeStatus) {
      return ['SETTLED', 'CHECKOUT', 'ACCEPTED'].includes(disputeStatus)
    },

    hoverDisputeCode(code) {
      if (!this.disputeTimeline[code]) {
        this.getDisputeTimeline(code)
      }
    },

    openTimelineModal(dispute) {
      const { code, id } = dispute
      if (!this.disputeTimeline[code] || this.disputeTimeline[code].lawsuits.length === 0) {
        return
      }
      this.currentDisputeCode = code
      this.$nextTick(() => {
        this.disputeTimelineModal = true
        this.addHighlight(id)
      })
      this.$jusSegment('Linha do tempo visualizada pelo gerenciamento', { disputeId: dispute.id })
    },

    cellMouseEnter(row, column, cell, event) {
      this.disputeActionsRow = row.id
      if (column.property !== 'code') {
        this.lastAccessTooltipTimeout = setTimeout(() => {
          this.getDisputeLastAccess(row.id).then(() => {
            this.actieTooltipDisputeId = row.id
          })
        }, 600)
      }
    },

    cellMouseLeave() {
      clearTimeout(this.lastAccessTooltipTimeout)
      this.actieTooltipDisputeId = 0
    },

    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus),

    tableRowClassName({ row, rowIndex }) {
      let className = ''
      if (!row.visualized && !this.tab1) {
        className += ' el-table__row--visualized-row'
      }
      if (this.activeDisputeIds.includes(row.id)) {
        className += ' el-table__row--highlighted'
      }
      return className
    },

    handleRowClick(row, column, event) {
      if (!event.ctrlKey && !event.metaKey && column.property === 'firstClaimant' && event.target.className.split(' ').includes('online-icon')) {
        this.openActiveMessageModal(row)
      } else if (!event.ctrlKey && !event.metaKey && column.property === 'firstClaimantLawyer' && row.firstClaimantLawyer) {
        this.$emit('search:lawyer', { lawyer: row.firstClaimantLawyer })
      } else if (row.id && !['IMG', 'SPAN', 'BUTTON', 'I'].includes(event.target.tagName)) {
        if (event.ctrlKey || event.metaKey) {
          window.open(`/#/management/dispute/${row.id}`, '_blank')
          this.addHighlight(row.id)
        } else {
          this.$router.push({ name: 'dispute', params: { id: row.id } })
        }
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
      this.protocolDialogVisible = true
      this.selectedDispute = dispute
    },

    handleSelectionAllDisputes(recent) {
      recent.forEach(dispute => this.$refs.disputeTable.toggleRowSelection(dispute))
    },

    infiniteHandler($state) {
      const isAllChecked = this.disputes.length === this.selectedIdsComp.length
      this.$store.commit('addDisputeQueryPage')
      this.$store.dispatch('getDisputes', 'nextPage').then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
        }

        if (isAllChecked) {
          this.handleSelectionAllDisputes(response.content)
        }
      })
    },

    handleHeaderClick(column, _event) {
      switch (column.label) {
        case 'Interações':
          this.handleInteractionsSort()
          break
        default:
          break
      }
    },

    async invertSort(key) {
      const sort = { asc: 'desc', desc: 'asc' }[this.sortStripped[key]]

      const newSort = await (this.sortQuery?.sort || []).reduce((acc, cur) => {
        if (cur.includes(key)) return [...acc, `${key},${sort}`]
        else return [...acc, cur]
      }, [])

      await this.updateDisputeQuery({ key: 'sort', value: newSort })

      return Promise.resolve()
    },

    async handleInteractionsSort() {
      if (this.sortKeys.includes('lastInboundInteraction.createdAt')) {
        for (const item of ['lastInboundInteraction.createdAt']) { await this.invertSort(item) }
        this.getDisputes()
      } else {
        this.updateDisputeQuery({
          key: 'sort',
          value: [
            ...this.sortQuery?.sort,
            'lastInboundInteraction.createdAt,asc'
          ]
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.first-claimant-container {
  .cell {
    .first-claimant-container__cell {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}

.el-table__row--highlighted {
  background-color: $--color-info-lighter !important;
}

.management-table__container {
  height: calc(100% - 114px);

  @media (max-height: 780px) {
    height: calc(100% - 93px);
  }
}

.management-table {
  @media (max-height: 780px) {
    margin-bottom: 0;
  }

  th {
    @media (max-height: 780px) {
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
  &__interaction-pulse {
    position: absolute;
    font-size: 14px;
    bottom: -5px;
    right: -3px;
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
      border: 1px solid $--color-primary;
    }
  }
  &__protocol_button--step {
    &-1 {
      span:first-child {
        background-color: $--color-primary;
        border-color: $--color-primary;
      }
    }
    &-2 {
      span:first-child, span:nth-child(2) {
        background-color: $--color-primary;
        border-color: $--color-primary;
      }
    }
    &-3 {
      span {
        background-color: $--color-primary;
        border-color: $--color-primary;
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
    color: $--color-text-secondary;
    font-size: 1rem;
  }
}
.management-table__tooltip-last-access {
  height: 1rem;
  display: flex;
  align-items: center;
  background-color: #e3def2;
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

.management-table__prenegotiation-tooltip {
  max-width: 400px;
}
</style>
