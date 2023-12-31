<template>
  <div class="management-table__container">
    <jus-protocol-dialog
      :protocol-dialog-visible.sync="protocolDialogVisible"
      :dispute-id.sync="selectedDispute.getDisputeId"
      :dispute.sync="selectedDispute"
    />

    <el-table
      ref="disputeTable"
      :key="disputeKey"
      v-loading="responseBoxLoading || scrollLoading"
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
        <template #default="scope">
          <DisputeCodeLink
            :code="scope.row.getDisputeCode"
            :custom-style="{ fontWeight: (!scope.row.getDisputeVisualized && !['1'].includes(activeTab))? 'bold' : 'normal'}"
            tj-placement="bottom"
            @hoverDisputeCode="hoverDisputeCode(scope.row.getDisputeCode)"
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
          v-if="scope.row.getDisputeCampaignName"
          slot-scope="scope"
        >
          <el-tooltip
            placement="top-start"
            :value="actieTooltipDisputeId === scope.row.getDisputeId"
            :content="!!lastAccess[scope.row.getDisputeId] ? lastAccess[scope.row.getDisputeId].date : 'Ainda não sei quando você acessou esta disputa'"
          >
            <div>
              {{ scope.row.getDisputeCampaignName | capitalize }}
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
        <template #default="scope">
          <div class="first-claimant-container__cell">
            <jus-vexatious-alert
              v-if="(scope.row.getDisputeHasFirstClaimantAlerts)"
              :document-number="scope.row.getDisputeFirstClaimantDocumentNumber"
              :name="scope.row.getDispueFirstClaimantName"
              style="display: flex; align-items: center;"
            />

            <el-tooltip
              v-if="scope.row.getDisputeHasFirstClaimant"
              class="online-icon"
              :content="`${$options.filters.capitalize(scope.row.getDisputeFirstClaimantFirstName)} está online`"
            >
              <jus-icon
                v-if="onlineDocuments[scope.row.getDisputeFirstClaimantDocumentNumber] === 'ONLINE'"
                icon="online"
                style="height: 8px; width: 8px;"
              />
            </el-tooltip>

            {{ scope.row.getDisputeFirstClaimantName || '-' | capitalize }}
          </div>

          <FollowUp :dispute="scope.row" />
        </template>
      </el-table-column>

      <el-table-column
        :sortable="false"
        prop="firstClaimantLawyer"
        class-name="text-ellipsis first-claimant-container"
        :label="$tc('fields.claimantLawyer', isRecoveryStrategy)"
        min-width="154px"
      >
        <template #default="scope">
          <div class="first-claimant-container__cell">
            <jus-vexatious-alert
              v-if="scope.row.getDisputeHasFirstClaimantLawyerAlerts"
              :document-number="scope.row.getDisputeFirstClaimantLawyerDocumentNumber"
              style="display: flex;"
            />

            <el-tooltip
              v-if="scope.row.getDisputeHasFirstClaimantLawyer"
              :content="`${$options.filters.capitalize(scope.row.getDisputeFirstClaimantLawyerFirstName)} está online`"
            >
              <jus-icon
                v-if="onlineDocuments[scope.row.getDisputeFirstClaimantLawyerDocumentNumber] === 'ONLINE'"
                icon="online"
                style="height: 8px; width: 8px;"
              />

              <jus-icon
                v-else-if="onlineDocuments[scope.row.getDisputeFirstClaimantLawyerOab] === 'ONLINE'"
                icon="online"
                style="height: 8px; width: 8px;"
              />
            </el-tooltip>

            <el-tooltip
              content="Buscar disputas com este advogado"
              :disabled="!scope.row.getDisputeHasFirstClaimantLawyer"
              :open-delay="500"
            >
              <span
                v-if="scope.row.getDisputeHasFirstClaimant"
                @click="$emit('search:lawyer', { lawyer: scope.row.getDisputeFirstClaimantLawyerName })"
              >
                {{ scope.row.getDisputeFirstClaimantLawyerName | capitalize }}
              </span>
            </el-tooltip>

            <span v-if="!scope.row.getDisputeHasFirstClaimantLawyer">-</span>
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
        <template #default="scope">
          <span v-if="scope.row.getDisputeUpperRange">
            {{ scope.row.getDisputeUpperRange | currency }}
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
        <template #default="scope">
          {{ scope.row.getDisputeLastOfferValue | currency }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="tab2 || tab3 || tab4"
        min-width="140px"
        align="center"
        label="Interações"
      >
        <template #header>
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

        <template #default="scope">
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
        <template #default="scope">
          <el-tag
            v-if="scope.row.getDisputeIsWon || scope.row.getDisputeHasDocument"
            effect="plain"
            size="small"
            class="management-table__protocol_button"
            @click="showProtocolModal(scope.row)"
          >
            Minuta
            <div :class="'management-table__protocol_button--step-' + getDocumentStep(scope.row.getDisputeHasDocument, scope.row.getDisputeSignStatus)">
              <span /><span /><span />
            </div>
          </el-tag>
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
        <template #default="scope">
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
        <template #default="scope">
          <el-tooltip
            v-if="scope.row.getDisputePropertyPreNegotiationWords && scope.row.getDisputeProperty('MOTIVO PRE NEGOCIACAO')"
            :open-delay="600"
            popper-class="management-table__prenegotiation-tooltip"
          >
            <span
              slot="content"
              v-html="scope.row.getDisputeProperty('MOTIVO PRE NEGOCIACAO')"
            />

            <span>
              {{ scope.row.getDisputePropertyPreNegotiationWords.split(',').join(', ').replace(/[\[\]]/gi, '') || '-' }}
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
        <template #default="scope">
          <el-tooltip content="Negociação encerra nos próximos 3 dias">
            <span
              v-if="(scope.row.getDisputeHasExpirationDate && scope.row.getDisputeDisputeNextToExpire) && !(scope.row.getDisputeIsExpired)"
              data-testid="expiration-notify"
              class="management-table__expiration-icon position-relative"
            >
              <jus-icon icon="clock" />

              <i class="management-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary" />
            </span>
          </el-tooltip>

          <div v-if="scope.row.getDisputeDisputeNextToExpire">
            {{ 'Expira ' + $moment(scope.row.getDisputeExpirationDate).fromNow() }}
          </div>

          <span v-else-if="scope.row.getDisputeHasExpirationDate">
            {{ scope.row.getDisputeExpirationDate | moment('L') }}
          </span>
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
        <template #default="scope">
          {{ $t('occurrence.type.' + scope.row.getDisputeStatus) | capitalize }}
          <span v-if="scope.row.getDisputeIsPaused">(pausada)</span>
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
        <template #default="scope">
          <span v-if="scope.row.getDisputeDealValue && scope.row.getDisputeIsWon">
            {{ scope.row.getDisputeDealValue | currency }}
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
        <template #default="scope">
          <span v-if="scope.row.getDisputeHasDealDate && scope.row.getDisputeIsWon">
            {{ scope.row.getDisputeDealDate | moment('DD/MM/YY') }}
          </span>

          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="hidden-actions"
        width="1px"
      >
        <template #default="scope">
          <jus-dispute-actions
            v-if="disputeActionsRow === scope.row.getDisputeId"
            :dispute="scope.row"
            table-actions
            @open:newtab="addHighlight(scope.row.getDisputeId)"
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

      <JusScrollLoading
        slot="append"
        :loading.sync="scrollLoading"
        target=".el-table__body-wrapper"
        :ended="disputes.length >= sortQuery.total"
        :empty="sortQuery.total === 0"
        empty-text="Sem disputas"
        end-text="Fim das disputas"
        @load="infiniteHandler"
      />
    </el-table>

    <jus-timeline
      v-if="currentDisputeCode"
      v-model="disputeTimelineModal"
      :code="currentDisputeCode"
    />

    <negotiator-activeReply
      v-if="Object.keys(activeDispute).length"
      v-model="canShowDialogReplyEditor"
      :dispute="activeDispute"
      @close="canShowDialogReplyEditor = false"
    />
  </div>
</template>

<script>
import { getDocumentStep } from '@/utils'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ManagementTable',

  filters: {
    counterProposal: function({ getDisputeLastCounterOfferValue, getDisputeUpperRange, getDisputeLastOfferValue }) {
      if (getDisputeLastCounterOfferValue) {
        return getDisputeLastCounterOfferValue
      } else if (!getDisputeUpperRange && getDisputeLastOfferValue) {
        return getDisputeLastOfferValue
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
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert'),
    FollowUp: () => import('./partials/ManagementFollowUp'),
    JusScrollLoading: () => import('@/components/others/JusScrollLoading')
  },

  inject: {
    isTicket: {
      default: false
    }
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
      scrollLoading: false,
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
      sortQuery: 'disputeQuery',
      showNegotiationTypeMenu: 'showNegotiationTypeMenu'
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
      'setHideTicket',
      'getDisputeTimeline',
      'getDisputeLastAccess',
      'cleanDisputeLastAccess'
    ]),

    ...mapMutations(['updateDisputeQuery']),

    openActiveMessageModal(dispute) {
      this.activeDispute = dispute

      this.$nextTick().then(_ => { this.canShowDialogReplyEditor = true })
    },

    addHighlight(id) {
      this.activeDisputeIds.push(id)
    },

    clearHighlight() {
      this.activeDisputeIds = []
    },

    hoverDisputeCode(code) {
      if (!this.disputeTimeline[code]) {
        this.getDisputeTimeline(code)
      }
    },

    openTimelineModal(dispute) {
      console.log('openTimelineModal', dispute)
      const { getDisputeCode, getDisputeId } = dispute
      if (!this.disputeTimeline[getDisputeCode] || this.disputeTimeline[getDisputeCode].lawsuits.length === 0) return

      this.currentDisputeCode = getDisputeCode

      this.$nextTick(() => {
        this.disputeTimelineModal = true
        this.addHighlight(getDisputeId)
      })

      this.$jusSegment('Linha do tempo visualizada pelo gerenciamento', { disputeId: getDisputeId })
    },

    cellMouseEnter(row, column, cell, event) {
      this.disputeActionsRow = row.getDisputeId

      if (column.property !== 'code') {
        this.lastAccessTooltipTimeout = setTimeout(() => {
          this.getDisputeLastAccess(row.getDisputeId).then(() => {
            this.actieTooltipDisputeId = row.getDisputeId
          })
        }, 600)
      }
    },

    cellMouseLeave() {
      clearTimeout(this.lastAccessTooltipTimeout)
      this.actieTooltipDisputeId = 0
    },

    getDocumentStep,

    tableRowClassName({ row }) {
      let className = ''

      if (!row.getDisputeVisualized && !this.tab1) {
        className += ' el-table__row--visualized-row'
      }

      if (this.activeDisputeIds.includes(row.getDisputeId)) {
        className += ' el-table__row--highlighted'
      }

      return className
    },

    handleRowClick(row, column, event) {
      const isCtrl = event.ctrlKey
      const isMeta = event.metaKey

      if (!isCtrl && !isMeta && column.property === 'firstClaimant' && event.target.className.split(' ').includes('online-icon')) {
        this.openActiveMessageModal(row)
      } else if (row.getDisputeId && !['IMG', 'SPAN', 'BUTTON', 'I'].includes(event.target.tagName)) {
        this.setHideTicket(true)
        if (isCtrl || isMeta) {
          window.open(`/#/negotiation/${row.getDisputeId}`, '_blank')
          this.addHighlight(row.getDisputeId)
        } else {
          this.$router.push({ name: 'ticket', params: { id: row.getDisputeId } })
        }
      }
    },

    clearSelection() {
      this.$refs.disputeTable.clearSelection()
    },

    handleSelectionChange(selected) {
      const ids = []
      for (const dispute of selected) {
        if (dispute?.getDisputeId) {
          ids.push(dispute.getDisputeId)
        }
      }
      this.selectedIdsComp = ids
    },

    disputeNextToExpire(date) {
      return this.$moment(date).isBetween(this.$moment(), this.$moment().add(4, 'day'))
    },

    showProtocolModal(dispute) {
      this.selectedDispute = dispute

      this.$nextTick().then(_ => {
        this.protocolDialogVisible = true
      })
    },

    handleSelectionAllDisputes(recent) {
      recent.forEach(dispute => this.$refs.disputeTable.toggleRowSelection(dispute))
    },

    infiniteHandler(callback) {
      const isAllChecked = this.disputes.length === this.selectedIdsComp.length
      this.$store.commit('addDisputeQueryPage')
      this.$store.dispatch('getDisputes', 'nextPage').then(response => {
        callback()

        if (isAllChecked) {
          this.handleSelectionAllDisputes(response.content)
        }
      })
    },

    handleHeaderClick(column, _event) {
      if (column.label === 'Interações') this.handleInteractionsSort()
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
            ...(this.sortQuery?.sort || []),
            'lastInboundInteraction.createdAt,asc'
          ]
        })
      }
    },

    moment() {
      return this.$moment
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.first-claimant-container {
  .cell {
    display: flex;
    flex-direction: column;

    .first-claimant-container__cell {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .void-cell {
        flex: 1;
        text-align: center;
      }
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
