<template lang="html">
  <div>
    <div :class="{'active': active}" class="management-actions">
      <div class="management-actions__length">
        <i class="el-icon-check" /> {{ selectedIdsLength }}
      </div>
      <div>
        <el-button plain data-testid="batch-settled" @click="sendBatchAction('SETTLED')">{{ $t('action.SETTLED') }}</el-button>
        <el-button plain data-testid="batch-unsettled" @click="sendBatchAction('UNSETTLED')">{{ $t('action.UNSETTLED') }}</el-button>
        <el-button plain data-testid="batch-paused" @click="sendBatchAction('PAUSED')">{{ $t('action.PAUSED') }}</el-button>
        <el-button plain data-testid="batch-resume" @click="sendBatchAction('RESUME')">{{ $t('action.RESUME') }}</el-button>
        <el-button plain data-testid="batch-restartengagement" @click="sendBatchAction('RESTART_ENGAGEMENT')">REINICIAR</el-button>
        <el-button plain data-testid="batch-chageexpirationdate" @click="sendBatchAction('CHANGE_EXPIRATION_DATE')">DATA LIMITE</el-button>
        <el-button plain data-testid="batch-changestrategy" @click="sendBatchAction('CHANGE_STRATEGY')">ESTRATÉGIAS</el-button>
        <el-button plain data-testid="batch-changestrategy" @click="sendBatchAction('CHANGE_NEGOTIATOR')">NEGOCIADORES</el-button>
        <el-button plain data-testid="batch-enrich" @click="sendBatchAction('ENRICH')">{{ $t('action.ENRICH') }}</el-button>
        <el-button plain data-testid="batch-delete" @click="sendBatchAction('DELETE')">{{ $t('action.DELETE') }}</el-button>
      </div>
      <i class="el-icon-close" @click="clearSelection()"/>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="chooseUnsettledDialogVisible"
      title="Perder"
      class="management-actions__dialog"
      width="460px"
      data-testid="unsettled-dialog">
      <el-select
        v-loading="$store.state.loading"
        v-model="unsettledType"
        data-testid="select-unsettled"
        placeholder="Escolha o motivo da perda">
        <el-option
          v-for="(type, index) in unsettledTypes"
          :key="index"
          :label="type"
          :value="index" />
      </el-select>
      <span slot="footer">
        <el-button plain @click="chooseUnsettledDialogVisible = false">Cancelar</el-button>
        <el-button
          :disabled="!unsettledType"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('unsettled')">
          Continuar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeStrategyDialogVisible"
      title="Alterar estratégia"
      class="management-actions__dialog"
      width="460px"
      data-testid="strategy-dialog">
      <el-select
        v-model="newStrategyId"
        placeholder="Escolha a nova estratégia"
        data-testid="select-unsettled">
        <el-option
          v-for="strategy in strategies"
          :key="strategy.id"
          :value="strategy.id"
          :label="strategy.name"/>
      </el-select>
      <span slot="footer">
        <el-button plain @click="changeStrategyDialogVisible = false">Cancelar</el-button>
        <el-button
          :disabled="!newStrategyId"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_STRATEGY')">
          Alterar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeExpirationDialogVisible"
      title="Alterar data limite da negociação"
      class="management-actions__dialog"
      width="460px"
      data-testid="expiration-dialog">
      <el-date-picker
        v-model="newExpirationDate"
        :clearable="false"
        data-testid="expiration-date-input"
        format="dd/MM/yyyy"
        type="date"
        placeholder="Escolha a data limite"
        value-format="yyyy-MM-dd" />
      <span slot="footer">
        <el-button plain @click="changeExpirationDialogVisible = false">Cancelar</el-button>
        <el-button
          :disabled="!newExpirationDate"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_EXPIRATION_DATE')">
          Alterar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeNegotiatorDialogVisible"
      title="Alterar negociadores"
      class="management-actions__dialog"
      width="604px">
      <div v-if="disputeNegotiatorMap.length" class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-info"/>
          <div class="el-message-box__message">
            <p>
              Alterando
              {{ disputeNegotiatorMap[currentDisputeNegotiatorMap].disputes.length }}
              disputas num total de
              {{ disputeNegotiatorMapSelectedIds.length }}.
            </p>
          </div>
        </div>
      </div>
      <br>
      <el-transfer
        v-loading="changeNegotiatorDialogLoading"
        :titles="['Equipe', 'Disputa']"
        :button-texts="['Remover', 'Adicionar']"
        :data="workspaceNegotiators"
        v-model="disputeNegotiators"
        filter-placeholder="Buscar"
        filterable />
      <span slot="footer">
        <el-button :disabled="changeNegotiatorDialogLoading" plain @click="changeNegotiatorDialogVisible = false">Cancelar</el-button>
        <el-button :loading="changeNegotiatorDialogLoading" :disabled="!disputeNegotiators.length" type="primary" @click="changeNegotiator()">
          Alterar
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTracktitleByAction, getRoles } from '@/utils/jusUtils'

export default {
  name: 'ManagementActions',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    selectedIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chooseUnsettledDialogVisible: false,
      changeStrategyDialogVisible: false,
      changeNegotiatorByGroup: false,
      changeNegotiatorDialogVisible: false,
      changeNegotiatorDialogLoading: false,
      disputeNegotiatorMapSelectedIds: 0,
      disputeNegotiators: [],
      disputeNegotiatorMap: [],
      currentDisputeNegotiatorMap: 0,
      unsettledTypes: [],
      unsettledType: '',
      newStrategyId: '',
      newExpirationDate: ''
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
    selectedIdsLength () {
      return this.selectedIdsComp.length
    },
    strategies () {
      return this.$store.getters.strategyList
    },
    workspaceNegotiators () {
      return this.$store.getters.workspaceMembers.map(member => {
        return {
          key: member.person.id,
          label: member.person.name,
          value: member.person.id
        }
      })
    }
  },
  created () {
    if (this.$store.getters.disputeStatuses.unsettled) {
      this.unsettledTypes = this.$store.getters.disputeStatuses.unsettled
    } else {
      this.$store.dispatch('getDisputeStatuses', 'unsettled').then(response => {
        this.unsettledTypes = response
      })
    }
    this.$store.dispatch('getMyStrategies')
  },
  methods: {
    doAction (action) {
      let params = {
        type: action.toUpperCase(),
        disputeIds: this.selectedIds
      }
      if (this.unsettledType) params['unsettledReasons'] = { [this.unsettledType]: this.unsettledTypes[this.unsettledType] }
      switch (action) {
        case 'CHANGE_STRATEGY':
          params['strategyId'] = this.newStrategyId
          break
        case 'CHANGE_EXPIRATION_DATE':
          params['expirationDate'] = { dateTime: this.$moment(this.newExpirationDate).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]') }
          break
      }
      this.$store.dispatch('sendBatchAction', params).then(response => {
        this.chooseUnsettledDialogVisible = false
        this.changeStrategyDialogVisible = false
        this.changeExpirationDialogVisible = false
        this.selectedIdsComp = []
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
        // SEGMENT TRACK
        this.$jusSegment(getTracktitleByAction(action, true), { amount: this.selectedIds.length })
        if (action === 'unsettled') {
          setTimeout(() => {
            this.$jusNotification({
              title: 'Atenção!',
              message: 'Enviaremos para às contrapartes uma mensagem de encerramento de negociação.',
              type: 'info',
              duration: 0
            })
          }, 2000)
        }
      }).catch(e => {
        if (e.response.data.reason.length) {
          this.$jusNotification({
            type: 'error',
            message: e.response.data.reason + '. Tente novamente ou entre em contato com o administrador do sistema.'
          })
        } else {
          this.$jusNotification({ type: 'error' })
        }
      })
    },
    sendBatchAction (action) {
      if (action === 'UNSETTLED') {
        this.chooseUnsettledDialogVisible = true
        this.unsettledType = ''
      } else if (action === 'CHANGE_STRATEGY') {
        this.changeStrategyDialogVisible = true
        this.newStrategyId = ''
      } else if (action === 'CHANGE_EXPIRATION_DATE') {
        this.changeExpirationDialogVisible = true
        this.newExpirationDate = ''
      } else if (action === 'CHANGE_NEGOTIATOR') {
        this.checkDisputeNegotiators()
      } else {
        this.$confirm('Tem certeza que deseja realizar esta ação em lote?', this.$options.filters.capitalize(this.$t('action.' + action.toUpperCase())), {
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          cancelButtonClass: 'is-plain'
        }).then(() => {
          if (action === 'ENRICH') this.enrichDisputes(action)
          else this.doAction(action)
        })
      }
    },
    enrichDisputes (action) {
      let selecteds = this.selectedIds
      let reengagement = []
      for (let selected of selecteds) {
        reengagement.push(
          this.$store.dispatch('enrichDispute', selected)
        )
      }
      Promise.all(reengagement).then(() => {
        this.$jusSegment('Reiniciar engajamento em massa')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
      }).catch(e => {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada. Parece que algumas das disputas selecionadas não foram enriquecidas.',
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
      })
      this.selectedIdsComp = []
    },
    clearSelection () {
      this.$emit('disputes:clear')
    },
    checkDisputeNegotiators () {
      let disputeNegotiatorMap = []
      this.disputeNegotiatorMap = []
      this.changeNegotiatorByGroup = false
      this.disputeNegotiatorMapSelectedIds = this.selectedIds
      for (var disputeId of this.selectedIds) {
        let dispute = this.$store.getters.disputes.find(d => d.id === disputeId)
        let disputeNegotiators = getRoles(dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR').map(dn => dn.personId)
        let mapToChangeIndex = disputeNegotiatorMap.findIndex(dnm => this.arraysEqual(dnm.negotiators, disputeNegotiators))
        if (mapToChangeIndex === -1) {
          disputeNegotiatorMap.push({
            disputes: [dispute.id],
            negotiators: disputeNegotiators
          })
        } else {
          let mapToChange = disputeNegotiatorMap[mapToChangeIndex]
          mapToChange.disputes.push(dispute.id)
          disputeNegotiatorMap[mapToChangeIndex] = mapToChange
        }
      }
      if (disputeNegotiatorMap.length === 1) {
        this.disputeNegotiators = disputeNegotiatorMap[0].negotiators
        this.changeNegotiatorDialogVisible = true
      } else {
        this.$confirm('As disputas selecionadas possuem negociadores diferentes. Deseja trata-los individualmente ou troca-los todos?', {
          title: 'Atenção! Múltiplos negociadores',
          confirmButtonText: 'Trocar todos',
          cancelButtonText: 'Escolher negociadores de cada disputa',
          cancelButtonClass: 'is-plain',
          type: 'warning',
          distinguishCancelAndClose: true,
          customClass: 'el-message-box--lg'
        }).then(() => {
          this.disputeNegotiators = []
          this.changeNegotiatorDialogVisible = true
        }).catch(action => {
          if (action === 'cancel') {
            this.currentDisputeNegotiatorMap = 0
            this.changeNegotiatorByGroup = true
            this.disputeNegotiators = disputeNegotiatorMap[this.currentDisputeNegotiatorMap].negotiators
            this.disputeNegotiatorMap = disputeNegotiatorMap
            this.changeNegotiatorDialogVisible = true
          }
        })
      }
    },
    arraysEqual (a, b) {
      if (a === b) return true
      if (a === null || b === null) return false
      if (a.length !== b.length) return false
      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
      }
      return true
    },
    changeNegotiator () {
      let isByGroup = !!this.disputeNegotiatorMap.length
      let params = {
        type: 'CHANGE_NEGOTIATOR',
        negotiatorsId: this.disputeNegotiators
      }
      if (isByGroup) {
        params.disputeIds = this.disputeNegotiatorMap[this.currentDisputeNegotiatorMap].disputes
      } else {
        params.disputeIds = this.selectedIds
      }
      this.changeNegotiatorDialogLoading = true
      this.$store.dispatch('sendBatchAction', params).then(response => {
        this.changeNegotiatorDialogVisible = false
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.CHANGE_NEGOTIATOR') + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
        // SEGMENT TRACK
        this.$jusSegment(getTracktitleByAction('CHANGE_NEGOTIATOR', true), { amount: this.selectedIds.length })
        setTimeout(() => {
          this.currentDisputeNegotiatorMap += 1
          if (this.disputeNegotiatorMap.length > this.currentDisputeNegotiatorMap) {
            this.disputeNegotiators = this.disputeNegotiators = this.disputeNegotiatorMap[this.currentDisputeNegotiatorMap].negotiators
            this.changeNegotiatorDialogVisible = true
          } else {
            this.currentDisputeNegotiatorMap = 0
          }
        }, 200)
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.changeNegotiatorDialogLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.management-actions {
  overflow-x: auto;
  position: absolute;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 3;
  padding: 0 20px;
  transition: all 0.5s ease;
  display: flex;
  justify-content:space-between;
  align-items: center;
  margin: -44px 0px 0;
  transform: translateY(-100%);
  border-radius: 5px 5px 0 0;
  div {
    display: flex;
  }
  &.active {
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
    margin: 0px;
    transform: translateY(-29%);
  }
  i {
    cursor: pointer;
    text-align: right;
  }
  button {
    margin-left: 0 !important;
    height: 68px;
    padding: 8px;
    font-size: 14px;
    border: 0;
    border-radius: 0;
    text-transform: uppercase;
    &:hover {
      background-color: #fafafa !important;
    }
  }
  &__length {
    color: #9461f7;
    font-weight: 500;
    font-size: 14px;
    width: 42px;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    i {
      margin-right: 4px;
      font-weight: 600;
    }
  }
  .el-icon-close {
    padding: 0 20px 0px 8px;
    font-size: 16px;
  }
  &__dialog {
    .el-message-box__content {
      padding: 10px 0;
    }
    .el-select, .el-date-editor.el-input, .el-transfer {
      width: 100%;
    }
  }
}
</style>
