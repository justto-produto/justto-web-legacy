<template>
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
    class="ticket-table el-table--disputes"
    @row-click="handleRowClick"
  >
    <!-- @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave()"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
    @header-click="handleHeaderClick" -->

    <el-table-column
      type="selection"
      width="44px"
    />

    <!-- Processo -->
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
          :custom-style="{ fontWeight: (!scope.row.visualized && !tab1)? 'bold' : 'normal'}"
          tj-placement="bottom"
        />
        <!-- @hoverDisputeCode="hoverDisputeCode(scope.row.code)"
        @openTimeline="openTimelineModal(scope.row)" -->
      </template>
    </el-table-column>

    <!-- Campanha -->
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
        <!-- <el-tooltip
          placement="top-start"
          :value="actieTooltipDisputeId === scope.row.id"
          :content="!!lastAccess[scope.row.id] ? lastAccess[scope.row.id].date : 'Ainda não sei quando você acessou esta disputa'"
        >
        </el-tooltip> -->
        <div>
          {{ scope.row.campaign.name | capitalize }}
        </div>
      </template>
    </el-table-column>

    <!-- Parte -->
    <el-table-column
      :sortable="false"
      prop="firstClaimant"
      min-width="140px"
      class-name="text-ellipsis first-claimant-container"
      :label="$tc('fields.claimantParty', isRecoveryStrategy)"
    >
      <template v-slot="scope">
        <div class="first-claimant-container__cell">
          <JusVexatiousAlert
            v-if="(scope.row.firstClaimantAlerts && scope.row.firstClaimantAlerts.length)"
            :document-number="scope.row.firstClaimantDocumentNumber"
            :name="scope.row.firstClaimant"
            style="display: flex; align-items: center;"
          />

          <!-- <el-tooltip
            v-if="scope.row.firstClaimant"
            class="online-icon"
            :content="`${$options.filters.capitalize(scope.row.firstClaimant.toLowerCase().split(' ')[0])} está online`"
          >
            <jus-icon
              v-if="onlineDocuments[scope.row.firstClaimantDocumentNumber] === 'ONLINE'"
              icon="online"
              style="height: 8px; width: 8px;"
            />
          </el-tooltip> -->

          {{ scope.row.firstClaimant || '-' | capitalize }}
        </div>

        <FollowUp :dispute="scope.row" />
      </template>
    </el-table-column>

    <!-- Advogado da parte -->
    <el-table-column
      :sortable="false"
      prop="firstClaimantLawyer"
      class-name="text-ellipsis first-claimant-container"
      :label="$tc('fields.claimantLawyer', isRecoveryStrategy)"
      min-width="154px"
    >
      <template v-slot="scope">
        <div class="first-claimant-container__cell">
          <JusVexatiousAlert
            v-if="scope.row.firstClaimantLawyerAlerts && scope.row.firstClaimantLawyerAlerts.length"
            :document-number="scope.row.firstClaimantLawyerDocumentNumber"
            :alerts="scope.row.firstClaimantLawyerAlerts"
            style="display: flex;"
          />

          <!-- <el-tooltip
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
          </el-tooltip> -->

          <!-- <el-tooltip
            content="Buscar disputas com este advogado"
            :disabled="(scope.row.firstClaimantLawyer || '-') === '-'"
            :open-delay="500"
          >
          </el-tooltip> -->
          <div>
            {{ scope.row.firstClaimantLawyer || '-' | capitalize }}
          </div>
        </div>
      </template>
    </el-table-column>

    <!-- Alçada máxima -->
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

    <!-- Proposta -->
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

    <!-- Interações -->
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

    <!-- Minuta -->
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

    <!-- Proposta da parte -->
    <el-table-column
      v-if="tab2"
      :sortable="false"
      :label="isRecoveryStrategy ? 'Proposta do réu' : 'Proposta da parte'"
      align="center"
      prop="lastCounterOfferValue"
      min-width="120px"
    >
      <template v-slot="scope">
        {{ counterProposal(scope.row) | currency }}
      </template>
    </el-table-column>

    <!-- Motivo da Pré Negociação -->
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

    <!-- Fim da negociação -->
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

    <!-- Status -->
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

    <!-- Acordo -->
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

    <!-- Data do acordo -->
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

    <!-- Empty -->
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
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDocumentStep } from '@/utils'

export default {
  components: {
    DisputeCodeLink: () => import('@/components/buttons/DisputeCodeLink'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert'),
    FollowUp: () => import('@/views/main/management/partials/partials/ManagementFollowUp'),
    ManagementLastInteraction: () => import('@/views/main/management/partials/ManagementLastInteraction')
  },

  props: {
    tab: {
      type: String,
      default: 'running'
    }
  },

  data: () => ({
    showEmpty: false,
    showEmptyDebounce: '',
    disputeKey: 0,
    responseBoxLoading: false
  }),

  computed: {
    ...mapGetters({
      disputes: 'disputes',
      sortQuery: 'disputeQuery',
      showDraft: 'getIsDraftManagementActive',
      isRecoveryStrategy: 'isWorkspaceRecovery'
    }),

    tab0() {
      return this.tab === 'pre-negotiation'
    },

    tab1() {
      return this.tab === 'engagement'
    },

    tab2() {
      return this.tab === 'running'
    },

    tab3() {
      return this.tab === 'accepted'
    },

    tab4() {
      return this.tab === 'finished'
    },

    tabAll() {
      return this.tab === 'all'
    },

    tableRowClassName() {
      return ({ row }) => {
        let className = ''
        if (!row.visualized && !this.tab1) {
          className += ' el-table__row--visualized-row'
        }
        // if (this.activeDisputeIds.includes(row.id)) {
        //   className += ' el-table__row--highlighted'
        // }
        return className
      }
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
    },

    counterProposal() {
      return ({ lastCounterOfferValue, disputeUpperRange, lastOfferValue }) => {
        if (lastCounterOfferValue) {
          return lastCounterOfferValue
        } else if (!disputeUpperRange && lastOfferValue) {
          return lastOfferValue
        } else {
          return 0
        }
      }
    }
  },

  methods: {
    handleRowClick() {},

    isWonDispute(disputeStatus) {
      return ['SETTLED', 'CHECKOUT', 'ACCEPTED'].includes(disputeStatus)
    },

    disputeNextToExpire(date) {
      return this.$moment(date).isBetween(this.$moment(), this.$moment().add(4, 'day'))
    },

    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus)
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.ticket-table__container {
  min-height: 100%;
  // height: calc(100% - 114px);

  // @media (max-height: 780px) {
  //   height: calc(100% - 93px);
  // }

  .ticket-table {
    height: 100%;

    .el-table__body-wrapper {
      height: 100% !important;

      .first-claimant-container {
        .cell {
          display: flex;
          flex-direction: column;

          .first-claimant-container__cell {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }
      }
    }

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
}
</style>
