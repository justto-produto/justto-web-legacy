<template>
  <div style="height: calc(100% - 90px);">
    <jus-protocol-dialog
      :protocol-dialog-visible.sync="protocolDialogVisible"
      :dispute-id.sync="selectedDisputeId"
      :dispute-roles.sync="selectedDisputeRoles" />
    <el-table
      ref="disputeTable"
      :key="disputeKey"
      :data.sync="disputes"
      :row-class-name="tableRowClassName"
      size="mini"
      empty-text=" "
      height="100%"
      class="management-table el-table--disputes"
      data-testid="dispute-index"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="44px" />
      <el-table-column
        v-if="tab1"
        :sortable="false"
        min-width="66px"
        align="center"
        class-name="management-table__row-info">
        <template slot-scope="scope">
          <el-tooltip :disabled="(scope.row.id % 3) !== 2" popper-class="info">
            <div slot="content">
              <strong>Última mensagem enviada</strong><br>
              <jus-icon icon="email" is-white /> LUCAS@JUSTTO.COM.BR <br>
              Total de leituras: 3 <br>
              Última leitura: 07/01 às 17h38
              <br><br>
              <strong>Sumário de interações</strong><br>
              Primeira interação: 02/01 às 11h22 <br>
              Total de interações: 18
            </div>
            <jus-icon :icon="'status-' + scope.row.id % 3" />
          </el-tooltip>
          <el-tooltip :disabled="!!(scope.row.id % 2)">
            <div slot="content">
              Último acesso ao sistema Justto: 07/01 às 17h38
            </div>
            <jus-icon :is-active="!(scope.row.id % 2)" icon="justto" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        label="Processo"
        min-width="100px"
        prop="code">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="campaignName"
        label="Campanha"
        min-width="94px">
        <template v-if="scope.row.campaign" slot-scope="scope">{{ scope.row.campaign.name | capitalize }}</template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="firstClaimant"
        min-width="140px"
        class-name="text-ellipsis"
        label="Parte(s) contrária(s)">
        <template slot-scope="scope">
          {{ scope.row.firstClaimant }}
        </template>
      </el-table-column>
      <el-table-column
        :sortable="false"
        prop="firstClaimantLawyer"
        class-name="text-ellipsis"
        label="Advogado(s) da parte"
        min-width="154px">
        <template slot-scope="scope">
          {{ scope.row.firstClaimantLawyer }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab0 || tab1"
        :sortable="false"
        label="Alçada máxima"
        align="center"
        prop="disputeUpperRange"
        min-width="118px">
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
        min-width="114px">
        <template slot-scope="scope">
          {{ scope.row.lastOfferValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab1 || tab2"
        :sortable="false"
        prop="lastInteractionDate"
        label="Última interação"
        min-width="124px"
        align="center">
        <template slot-scope="scope">
          <span class="position-relative">
            <jus-icon v-if="scope.row.lastInteraction" :icon="getInteractionIcon(scope.row.lastInteraction)" class="management-table__interaction-icon" />
            <i v-if="!scope.row.visualized" class="management-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary" />
          </span>
          <el-tooltip v-if="scope.row.lastInteraction" :content="scope.row.lastInteraction.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm')">
            <span style="margin-left: 4px;">
              {{ getLastInteraction(scope.row.lastInteraction.createAt.dateTime) }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab1"
        :sortable="false"
        label="Contraproposta"
        align="center"
        prop="lastCounterOfferValue"
        min-width="120px">
        <template slot-scope="scope">
          {{ scope.row.lastCounterOfferValue | currency }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab0 || tab1 || tab3"
        :sortable="false"
        prop="expirationDate"
        label="Fim da negociação"
        align="center"
        min-width="140px">
        <template slot-scope="scope">
          <el-tooltip content="Negociação encerra nos próximos 3 dias">
            <span v-if="(disputeNextToExpire(scope.row.expirationDate.dateTime) || scope.row.disputeNextToExpire) && scope.row.status !== 'EXPIRED'" data-testid="expiration-notify" class="management-table__expiration-icon position-relative">
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
        width="120px">
        <template slot-scope="scope">{{ scope.row.disputeDealValue | currency }}</template>
      </el-table-column>
      <el-table-column
        v-if="tab2"
        :sortable="false"
        prop="disputeDealDate"
        label="Data do acordo"
        min-width="118px"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.disputeDealDate">{{ scope.row.disputeDealDate.dateTime | moment('DD/MM/YY') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tab3"
        :sortable="false"
        label="Status"
        prop="status"
        align="center"
        min-width="90px">
        <template slot-scope="scope">
          {{ $t('occurrence.type.' + scope.row.status) | capitalize }}
          <span v-if="scope.row.paused">(pausada)</span>
        </template>
      </el-table-column>
      <el-table-column
        :width="tab2 ? '152px' : '76px'"
        class-name="management-table__row-actions"
        align="right">
        <template slot-scope="scope">
          <el-button
            v-if="tab2"
            plain
            size="mini"
            class="management-table__protocol_button"
            @click="showProtocolModal(scope.row)">
            Minuta
            <div :class="'management-table__protocol_button--step-' + getDocumentStep(scope.row.hasDocument, scope.row.signStatus)">
              <span/><span/><span/>
            </div>
          </el-button>
          <el-button
            type="text"
            @click="setFavorite(scope.row.favorite ? 'disfavor' : 'favorite', scope.row.id, 'ENGAJAMENTO')">
            <jus-icon :icon="scope.row.favorite ? 'golden-star' : 'star'" />
          </el-button>
          <el-button
            title="Abrir disputa em uma nova aba"
            type="text"
            @click="openNewTab(scope.row.id)">
            <jus-icon icon="external-link" />
          </el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <span v-if="!loadingDisputes">
          <jus-icon icon="empty-screen-filter" class="management-table__empty-table" data-testid="cases-empty-icon"/>
          <h4 data-testid="cases-empty-text">
            Não foram encontradas disputas para<br>os filtros selecionados.
          </h4>
        </span>
      </template>
    </el-table>
  </div>
</template>

<script>
import { getLastInteraction, getInteractionIcon } from '@/utils/jusUtils'

export default {
  name: 'ManagementTable',
  components: {
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume'),
    JusProtocolDialog: () => import('@/components/dialogs/JusProtocolDialog')
  },
  props: {
    activeTab: {
      type: String,
      default: '0'
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
  data () {
    return {
      protocolDialogVisible: false,
      selectedDisputeId: 0,
      selectedDisputeRoles: [],
      disputeKey: 0
    }
  },
  computed: {
    // allowDocument () {
    //   return [484, 293, 200, 234, 198, 294].includes(this.$store.getters.accountId) ||
    //     [/* cabanellos */92, 227, 230, 229, 137, 182, 202,
    //       /* vlm */228, 223, 220, 183, 206, 175, 169, 171].includes(this.$store.getters.workspaceId)
    // },
    selectedIdsComp: {
      get () {
        return this.selectedIds
      },
      set (ids) {
        this.$emit('update:selectedIds', ids)
      }
    },
    disputes () {
      return this.$store.getters.disputes
    },
    tab0 () {
      return this.activeTab === '0'
    },
    tab1 () {
      return this.activeTab === '1'
    },
    tab2 () {
      return this.activeTab === '2'
    },
    tab3 () {
      return this.activeTab === '3'
    }
  },
  watch: {
    disputes: {
      handler () {
        this.doLayout()
        this.disputeKey += 1
      },
      deep: true
    }
  },
  methods: {
    getLastInteraction: (i) => getLastInteraction(i),
    getInteractionIcon: (i) => getInteractionIcon(i),
    tableRowClassName ({ row, rowIndex }) {
      if (!row.visualized && !this.tab0) {
        return 'el-table__row--visualized-row'
      }
    },
    handleRowClick (row, column, event) {
      if (row.id && !['IMG', 'SPAN', 'BUTTON'].includes(event.target.tagName)) {
        this.$router.push({ name: 'dispute', params: { id: row.id } })
      }
    },
    clearSelection () {
      this.$refs.disputeTable.clearSelection()
    },
    doLayout () {
      this.$refs.disputeTable.doLayout()
    },
    handleSelectionChange (selected) {
      let ids = []
      for (let dispute of selected) {
        if (dispute && dispute.id) {
          ids.push(dispute.id)
        }
      }
      this.selectedIdsComp = ids
    },
    openNewTab (disputeId) {
      let routeData = this.$router.resolve({ name: 'dispute', params: { id: disputeId } })
      window.open(routeData.href, '_blank')
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
    disputeNextToExpire (date) {
      return this.$moment(date).isBetween(this.$moment(), this.$moment().add(4, 'day'))
    },
    showProtocolModal (dispute) {
      this.selectedDisputeId = dispute.id
      this.selectedDisputeRoles = dispute.disputeRoles
      this.protocolDialogVisible = true
    },
    getDocumentStep (hasDocument, signStatus) {
      if (hasDocument) {
        if (signStatus) {
          if (signStatus === 'SIGNING') {
            return 2
          } return 3
        } return 1
      } return 0
    }
  }
}
</script>

<style lang="scss">
.management-table {
  &__interaction-icon {
    vertical-align: middle;
    margin-right: 4px;
    max-height: 18px;
    max-width: 18px;
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
    font-size: 16px;
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
      & + img {
        margin-left: 8px;
        width: 15px;
      }
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
}
</style>
