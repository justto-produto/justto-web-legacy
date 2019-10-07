<template>
  <el-table
    ref="disputeTable"
    :data="disputes"
    :row-class-name="tableRowClassName"
    size="mini"
    height="100%"
    class="management-table el-table--disputes"
    data-testid="dispute-index"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="44px" />
    <el-table-column type="expand" width="20px">
      <template slot-scope="props">
        <jus-dispute-resume :dispute="props.row" />
      </template>
    </el-table-column>
    <el-table-column
      :sortable="false"
      label="Disputa"
      min-width="68px"
      prop="id">
      <template slot-scope="scope">#{{ scope.row.id }}</template>
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
      v-if="activeTab !== '3'"
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
      v-if="activeTab === '0'"
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
      v-if="['1', '2'].includes(activeTab)"
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
      v-if="activeTab === '1'"
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
      v-if="['0', '1', '3'].includes(activeTab)"
      :sortable="false"
      prop="expirationDate"
      label="Fim da negociação"
      align="center"
      min-width="140px">
      <template slot-scope="scope">
        <el-tooltip content="Negociação encerra nos próximos 3 dias">
          <span v-if="(disputeNextToExpire(scope.row.expirationDate.dateTime) || scope.row.disputeNextToExpire) && scope.row.status !== 'EXPIRED'" class="management-table__expiration-icon position-relative">
            <jus-icon icon="clock" />
            <i class="management-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary" />
          </span>
        </el-tooltip>
        <span v-if="scope.row.expirationDate">{{ scope.row.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="activeTab === '2'"
      :sortable="false"
      label="Valor do acordo"
      prop="disputeDealValue"
      align="center"
      width="120px">
      <template slot-scope="scope">{{ scope.row.disputeDealValue | currency }}</template>
    </el-table-column>
    <el-table-column
      v-if="activeTab === '2'"
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
      v-if="activeTab === '3'"
      :sortable="false"
      label="Status"
      prop="status"
      align="center"
      min-width="90px">
      <template slot-scope="scope">
        {{ $t('occurrence.type.' + scope.row.status) | capitalize }}
      </template>
    </el-table-column>
    <el-table-column
      width="70px"
      class-name="management-table__row-actions"
      align="center">
      <template slot-scope="scope">
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
    <template v-if="!$store.state.loading" slot="empty">
      <span>
        <jus-icon icon="empty-screen-filter" class="management-table__empty-table" data-testid="cases-empty-icon"/>
        <h4 data-testid="cases-empty-text">
          Não foram encontradas disputas para<br>os filtros selecionados.
        </h4>
      </span>
    </template>
  </el-table>
</template>

<script>
import { getLastInteraction, getInteractionIcon } from '@/plugins/jusUtils'

export default {
  name: 'ManagementTable',
  components: {
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume')
  },
  props: {
    activeTab: {
      type: String,
      default: '0'
    },
    selectedIds: {
      type: Array,
      default: () => []
    }
  },
  computed: {
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
    }
  },
  methods: {
    getLastInteraction: (i) => getLastInteraction(i),
    getInteractionIcon: (i) => getInteractionIcon(i),
    tableRowClassName ({ row, rowIndex }) {
      if (!row.visualized) {
        return 'el-table__row--visualized-row'
      }
    },
    handleRowClick (row, column, event) {
      if (row.id && event.target.tagName !== 'IMG') {
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
}
</style>
