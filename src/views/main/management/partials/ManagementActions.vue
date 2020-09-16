<template lang="html">
  <div>
    <div
      :class="{'active': active}"
      class="management-actions"
    >
      <div class="management-actions__length">
        <i class="el-icon-check" /> {{ selectedLenghtToShow }}
      </div>
      <div>
        <span
          v-for="action in actionsList"
          :key="action.name"
        >
          <el-button
            v-if="action.tabs.includes(activeTab)"
            :data-testid="`batch-${action.name.toLowerCase()}`"
            plain
            @click="sendBatchAction(action.name)"
          >
            {{ $t(`action.${action.name}`) }}
          </el-button>
        </span>
      </div>
      <i
        class="el-icon-close"
        @click="clearSelection()"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="chooseUnsettledDialogVisible"
      title="Perder"
      class="management-actions__dialog"
      width="460px"
      data-testid="unsettled-dialog"
    >
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p>Tem certeza que deseja perder esta disputa?.</p>
          </div>
        </div>
      </div>
      <el-select
        v-model="unsettledType"
        v-loading="$store.state.loading"
        data-testid="select-unsettled"
        placeholder="Escolha o motivo da perda"
      >
        <el-option
          v-for="(type, index) in disputeStatuses.UNSETTLED"
          :key="index"
          :label="type"
          :value="index"
        />
      </el-select>
      <span slot="footer">
        <el-button
          plain
          @click="chooseUnsettledDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :disabled="!unsettledType"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('UNSETTLED')"
        >
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
      data-testid="strategy-dialog"
    >
      <el-select
        v-model="newStrategyId"
        placeholder="Escolha a nova estratégia"
        data-testid="select-unsettled"
      >
        <el-option
          v-for="strategy in strategies"
          :key="strategy.id"
          :value="strategy.id"
          :label="strategy.name"
        />
      </el-select>
      <span slot="footer">
        <el-button
          plain
          @click="changeStrategyDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :disabled="!newStrategyId"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_STRATEGY')"
        >
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
      data-testid="expiration-dialog"
    >
      <el-date-picker
        v-model="newExpirationDate"
        :clearable="false"
        data-testid="expiration-date-input"
        format="dd/MM/yyyy"
        type="date"
        placeholder="Escolha a data limite"
        value-format="yyyy-MM-dd"
      />
      <span slot="footer">
        <el-button
          plain
          @click="changeExpirationDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :disabled="!newExpirationDate"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_EXPIRATION_DATE')"
        >
          Alterar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeNegotiatorDialogVisible"
      title="Alterar negociadores"
      class="management-actions__dialog"
      width="604px"
    >
      <div
        v-if="disputeNegotiatorMap.length"
        class="el-message-box__content"
      >
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-info" />
          <div class="el-message-box__message">
            <p>
              Alterando
              {{ disputeNegotiatorMap[currentDisputeNegotiator].disputes.length }}
              disputas num total de
              {{ allSelectedDisputes }}.
            </p>
          </div>
        </div>
      </div>
      <br>
      <el-transfer
        v-model="disputeNegotiators"
        v-loading="changeNegotiatorDialogLoading"
        :titles="['Equipe', 'Disputa']"
        :button-texts="['Remover', 'Adicionar']"
        :data="workspaceNegotiators"
        filter-placeholder="Buscar"
        filterable
      />
      <span slot="footer">
        <el-button
          :disabled="changeNegotiatorDialogLoading"
          plain
          @click="changeNegotiatorDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          :loading="changeNegotiatorDialogLoading"
          :disabled="!disputeNegotiators.length"
          type="primary"
          @click="changeNegotiator()"
        >
          Alterar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="chooseDeleteDialogVisible"
      class="management-actions__dialog"
      title="Excluir disputa"
      width="460px"
    >
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p>Tem certeza que deseja excluir esta disputa? Esta ação é irreversível.</p>
          </div>
        </div>
      </div>
      <el-select
        v-model="deleteType"
        style="width: 100%;"
        placeholder="Escolha o motivo da exclusão"
      >
        <el-option
          v-for="(type, index) in disputeStatuses.ARCHIVED"
          :key="index"
          :label="type"
          :value="index"
        />
      </el-select>
      <span slot="footer">
        <el-button
          plain
          @click="chooseDeleteDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          :disabled="!deleteType"
          type="primary"
          @click.prevent="doAction('DELETE')"
        >
          Excluir
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTracktitleByAction } from '@/utils/jusUtils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ManagementActions',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    activeTab: {
      type: String,
      required: true,
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chooseUnsettledDialogVisible: false,
      changeStrategyDialogVisible: false,
      changeNegotiatorDialogVisible: false,
      changeExpirationDialogVisible: false,
      changeNegotiatorDialogLoading: false,
      chooseDeleteDialogVisible: false,
      disputeNegotiators: [],
      disputeNegotiatorMap: [],
      currentDisputeNegotiator: 0,
      allSelectedDisputes: 0,
      unsettledType: '',
      deleteType: '',
      newStrategyId: '',
      newExpirationDate: '',
    }
  },
  computed: {
    ...mapGetters(['disputeStatuses']),

    selectedIdsComp: {
      get() {
        return this.selectedIds
      },
      set(ids) {
        this.$emit('update:selectedIds', ids)
      },
    },
    actionsList() {
      return [
        { name: 'SETTLED', tabs: ['0', '1', '2', '3'] },
        { name: 'UNSETTLED', tabs: ['0', '1', '2', '3'] },
        { name: 'PAUSED', tabs: ['0', '1', '2', '3'] },
        { name: 'RESUME', tabs: ['0', '1', '2', '3'] },
        { name: 'RESTART_ENGAGEMENT', tabs: ['0', '1', '2', '3'] },
        { name: 'CHANGE_EXPIRATION_DATE', tabs: ['0', '1', '2', '3'] },
        { name: 'CHANGE_STRATEGY', tabs: ['0', '1', '2', '3'] },
        { name: 'CHANGE_NEGOTIATOR', tabs: ['0', '1', '2', '3'] },
        { name: 'ENRICH_DISPUTE', tabs: ['0', '1', '2', '3'] },
        { name: 'DELETE', tabs: ['0', '1', '2', '3'] },
        { name: 'RESEND_MESSAGE', tabs: ['0', '1', '2', '3'] },
        { name: 'DROP_LAWSUIT', tabs: ['-1'] },
        { name: 'START_NEGOTIATON', tabs: ['-1'] },
      ]
    },
    strategies() {
      return this.$store.getters.strategyList
    },
    selectedIdsLength() {
      return this.selectedIdsComp.length
    },
    disputesTotalLength() {
      return this.$store.getters.disputeQuery.total
    },
    selectedLenghtToShow() {
      return this.isSelectedAll ? this.disputesTotalLength : this.selectedIdsLength
    },
    isSelectedAll() {
      return this.$store.getters.disputes.length === this.selectedIdsLength
    },
    workspaceNegotiators() {
      return this.$store.getters.workspaceMembers.map(member => {
        return {
          key: member.person.id,
          label: member.person.name,
          value: member.person.id,
        }
      })
    },
  },
  created() {
    if (!this.disputeStatuses.UNSETTLED || !Object.keys(this.disputeStatuses.UNSETTLED).length) {
      this.getDisputeStatuses('UNSETTLED')
    }
    if (!this.disputeStatuses.ARCHIVED || !Object.keys(this.disputeStatuses.ARCHIVED).length) {
      this.getDisputeStatuses('ARCHIVED')
    }
    this.$store.dispatch('getMyStrategies')
  },
  methods: {
    ...mapActions(['getDisputeStatuses']),

    doAction(action) {
      const params = {
        type: action.toUpperCase(),
        disputeIds: this.selectedIds,
      }
      switch (action) {
        case 'DROP_LAWSUIT':
          params.reasonKey = 'DISPUTE_DROPPED'
          params.type = 'DELETE'
          break
        case 'CHANGE_STRATEGY':
          params.strategyId = this.newStrategyId
          break
        case 'CHANGE_EXPIRATION_DATE':
          params.expirationDate = { dateTime: this.$moment(this.newExpirationDate).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]') }
          break
        case 'DELETE':
          if (this.deleteType) params.reasonKey = this.deleteType
          break
        case 'UNSETTLED':
          if (this.unsettledType) params.unsettledReasons = { [this.unsettledType]: this.disputeStatuses.UNSETTLED[this.unsettledType] }
          break
      }
      if (this.isSelectedAll) {
        params.allSelected = true
        params.disputeIds = []
      }
      this.$store.dispatch('sendBatchAction', params).then(response => {
        this.chooseDeleteDialogVisible = false
        this.chooseUnsettledDialogVisible = false
        this.changeStrategyDialogVisible = false
        this.changeExpirationDialogVisible = false
        this.selectedIdsComp = []
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true,
        })
        // SEGMENT TRACK
        this.$jusSegment(getTracktitleByAction(action, true), { amount: this.selectedIds.length })
        if (action === 'UNSETTLED') {
          setTimeout(() => {
            this.$jusNotification({
              title: 'Atenção!',
              message: 'Enviaremos para às contrapartes uma mensagem de encerramento de negociação.',
              type: 'info',
              duration: 0,
            })
          }, 2000)
        }
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.clearSelection()
      })
    },
    sendBatchAction(action) {
      if (action === 'UNSETTLED') {
        this.chooseUnsettledDialogVisible = true
        this.unsettledType = ''
      } else if (action === 'DELETE') {
        this.chooseDeleteDialogVisible = true
        this.deleteType = ''
      } else if (action === 'CHANGE_STRATEGY') {
        this.changeStrategyDialogVisible = true
        this.newStrategyId = ''
      } else if (action === 'CHANGE_EXPIRATION_DATE') {
        this.changeExpirationDialogVisible = true
        this.newExpirationDate = ''
      } else if (action === 'CHANGE_NEGOTIATOR') {
        this.checkDisputeNegotiators()
      } else {
        const message = {
          title: this.$options.filters.capitalize(this.$t('action.' + action.toUpperCase())),
          content: 'Tem certeza que deseja realizar esta ação em lote?',
        }
        if (action === 'ENRICH_DISPUTE' &&
            this.$store.getters.disputes.filter(d => this.selectedIds.includes(d.id) &&
            ['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(d.status)).length) {
          message.title = 'Atenção!'
          message.content = `Você está solicitando o <b>ENRIQUECIMENTO</b> de disputas que já
          foram finalizadas. Este processo irá agendar novamente as mensagens
          para as partes quando finalizado. Você deseja enriquecer mesmo assim?`
        }
        this.$confirm(message.content, message.title, {
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          dangerouslyUseHTMLString: true,
          cancelButtonClass: 'is-plain',
        }).then(() => {
          this.doAction(action)
        })
      }
    },
    clearSelection() {
      this.$emit('disputes:clear')
    },
    checkDisputeNegotiators() {
      const _ = require('lodash')
      let disputeNegotiatorMap = []
      this.disputeNegotiatorMap = []

      if (!this.isSelectedAll) this.$store.commit('updateDisputeQuery', { key: 'id', value: this.selectedIds })
      this.$store.dispatch('getNegotiators').then(response => {
        disputeNegotiatorMap = response

        let concatedDisputeIds = []
        for (const negotiator of disputeNegotiatorMap) {
          concatedDisputeIds = concatedDisputeIds.concat(negotiator.disputes)
        }

        const duplicatedDisputeIds = []
        concatedDisputeIds.map((dispute, i) => {
          if (concatedDisputeIds.indexOf(dispute) !== i) {
            duplicatedDisputeIds.push(dispute)
          }
        })

        this.allSelectedDisputes = concatedDisputeIds.length - duplicatedDisputeIds.length

        const multiNegotiatorsList = []

        disputeNegotiatorMap.map(negotiator => {
          const intersection = _.intersection(negotiator.disputes, duplicatedDisputeIds)
          if (intersection.length) {
            const currentNegotiatorIndex = multiNegotiatorsList.findIndex(n => {
              return !!_.intersection(negotiator.disputes, duplicatedDisputeIds).length
            })
            if (currentNegotiatorIndex === -1) {
              multiNegotiatorsList.push({
                disputes: intersection,
                negotiators: [negotiator.id],
              })
            } else {
              multiNegotiatorsList[currentNegotiatorIndex].negotiators.push(negotiator.id)
            }
            negotiator.disputes = _.difference(negotiator.disputes, intersection)
          }
        })

        disputeNegotiatorMap.map((negotiator, index) => {
          if (!negotiator.disputes.length) disputeNegotiatorMap.splice(index, 1)
        })

        const disputeNegotiatorList = disputeNegotiatorMap.map((negotiator, index) => {
          const { disputes, id } = negotiator
          return {
            disputes,
            negotiators: [id],
          }
        })

        const fullNegotiatorsList = multiNegotiatorsList.concat(disputeNegotiatorList)

        console.log(multiNegotiatorsList)
        console.log(disputeNegotiatorList)
        console.log(fullNegotiatorsList)

        if (fullNegotiatorsList.length === 1) {
          this.disputeNegotiators = fullNegotiatorsList[0].negotiators
          this.changeNegotiatorDialogVisible = true
        } else {
          this.$confirm('As disputas selecionadas possuem negociadores diferentes. Deseja trata-los individualmente ou troca-los todos?', {
            title: 'Atenção! Múltiplos negociadores',
            confirmButtonText: 'Trocar todos',
            cancelButtonText: 'Escolher negociadores de cada disputa',
            cancelButtonClass: 'is-plain',
            distinguishCancelAndClose: true,
            customClass: 'el-message-box--lg',
          }).then(() => {
            this.disputeNegotiators = []
            this.changeNegotiatorDialogVisible = true
          }).catch(action => {
            if (action === 'cancel') {
              this.currentDisputeNegotiator = 0
              this.disputeNegotiators = fullNegotiatorsList[this.currentDisputeNegotiator].negotiators
              this.disputeNegotiatorMap = fullNegotiatorsList
              this.changeNegotiatorDialogVisible = true
            }
          })
        }
      })
      this.$store.commit('updateDisputeQuery', { key: 'id', value: [] })
    },
    changeNegotiator() {
      const isByGroup = !!this.disputeNegotiatorMap.length
      const params = {
        type: 'CHANGE_NEGOTIATOR',
        negotiatorsId: this.disputeNegotiators,
      }
      if (this.isSelectedAll) {
        params.allSelected = true
        params.disputeIds = []
      } else if (isByGroup) {
        params.disputeIds = this.disputeNegotiatorMap[this.currentDisputeNegotiator].disputes
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
          dangerouslyUseHTMLString: true,
        })
        // SEGMENT TRACK
        this.$jusSegment(getTracktitleByAction('CHANGE_NEGOTIATOR', true), { amount: this.selectedIds.length })
        setTimeout(() => {
          this.currentDisputeNegotiator += 1
          if (this.disputeNegotiatorMap.length > this.currentDisputeNegotiator) {
            this.disputeNegotiators = this.disputeNegotiators = this.disputeNegotiatorMap[this.currentDisputeNegotiator].negotiators
            this.changeNegotiatorDialogVisible = true
          } else {
            this.currentDisputeNegotiator = 0
          }
        }, 200)
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.changeNegotiatorDialogLoading = false
      })
    },
  },
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
