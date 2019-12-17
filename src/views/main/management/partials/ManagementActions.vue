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
        <el-button plain data-testid="batch-restartengagement" @click="sendBatchAction('RESTART_ENGAGEMENT')">{{ $t('action.RESTART_ENGAGEMENT') }}</el-button>
        <el-button plain data-testid="batch-changestrategy" @click="sendBatchAction('CHANGE_STRATEGY')">{{ $t('action.CHANGE_STRATEGY') }}</el-button>
        <el-button plain data-testid="batch-chageexpirationdate" @click="sendBatchAction('CHANGE_EXPIRATION_DATE')">{{ $t('action.CHANGE_EXPIRATION_DATE') }}</el-button>
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
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning"/>
          <div class="el-message-box__message">
            <p>Tem certeza que deseja realizar esta ação?</p>
          </div>
        </div>
      </div>
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
        <el-button @click="chooseUnsettledDialogVisible = false">Cancelar</el-button>
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
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning"/>
          <div class="el-message-box__message">
            <p>Tem certeza que deseja realizar esta ação?</p>
          </div>
        </div>
      </div>
      <el-select
        v-model="newStrategyId"
        data-testid="select-unsettled"
        placeholder="Escolha a nova estratégia">
        <el-option
          v-for="strategy in strategies"
          :key="strategy.id"
          :value="strategy.id"
          :label="strategy.name"/>
      </el-select>
      <span slot="footer">
        <el-button @click="changeStrategyDialogVisible = false">Cancelar</el-button>
        <el-button
          :disabled="!newStrategyId"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_STRATEGY')">
          Continuar
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeExpirationDialogVisible"
      title="Alterar fim da negociação"
      class="management-actions__dialog"
      width="460px"
      data-testid="expiration-dialog">
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p>Tem certeza que deseja realizar esta ação?</p>
          </div>
        </div>
      </div>
      <el-date-picker
        v-model="newExpirationDate"
        :clearable="false"
        data-testid="expiration-date-input"
        format="dd/MM/yyyy"
        type="date"
        value-format="yyyy-MM-dd" />
      <span slot="footer">
        <el-button @click="changeExpirationDialogVisible = false">Cancelar</el-button>
        <el-button
          :disabled="!newExpirationDate"
          type="primary"
          class="confirm-action-unsettled"
          @click.prevent="doAction('CHANGE_EXPIRATION_DATE')">
          Continuar
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
      changeExpirationDialogVisible: false,
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
      let selecteds = this.selectedIdsLength
      let trackTitle
      if (action === 'SETTLED') {
        trackTitle = 'casos ganhos'
      } else if (action === 'unsettled') {
        trackTitle = 'casos perdidos'
      } else if (action === 'PAUSED') {
        trackTitle = 'disputas pausadas'
      } else if (action === 'RESUME') {
        trackTitle = 'disputas retomadas'
      } else if (action === 'DELETE') {
        trackTitle = 'casos deletados'
      } else if (action === 'RESTART_ENGAGEMENT') {
        trackTitle = 'engajamentos reiniciados'
      } else if (action === 'CHANGE_STRATEGY') {
        trackTitle = 'troca de estratégias'
      } else if (action === 'CHANGE_EXPIRATION_DATE') {
        trackTitle = 'altera fim de negociações'
      } else {
        trackTitle = 'Ação em massa realizada'
      }
      let params = {
        type: action.toUpperCase(),
        disputeIds: this.selectedIds
      }
      if (action === 'CHANGE_STRATEGY') {
        params['strategyId'] = this.newStrategyId
      }
      if (action === 'CHANGE_EXPIRATION_DATE') {
        params['expirationDate'] = {
          dateTime: this.$moment(this.newExpirationDate).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]')
        }
      }
      if (this.unsettledType) {
        params['unsettledReasons'] = { [this.unsettledType]: this.unsettledTypes[this.unsettledType] }
      }
      this.$store.dispatch('sendBatchAction', params).then(response => {
        this.chooseUnsettledDialogVisible = false
        this.changeStrategyDialogVisible = false
        this.changeExpirationDialogVisible = false
        window.analytics.track(selecteds + ' ' + trackTitle, {
          action: action,
          selecteds: selecteds
        })
        this.selectedIdsComp = []
        this.$store.dispatch('getDisputes')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
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
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
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
      } else {
        this.$confirm('Tem certeza que deseja realizar esta ação em lote?', this.$t('action.' + action.toUpperCase()), {
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          cancelButtonClass: 'is-plain'
        }).then(() => {
          this.doAction(action)
        })
      }
    },
    clearSelection () {
      this.$emit('disputes:clear')
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
    padding: 12px;
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
    width: 42px;
    justify-content: center;
    align-items: center;
    i {
      margin-right: 4px;
      font-weight: 600;
    }
  }
  .el-icon-close {
    width: 42px;
  }
  &__dialog {
    .el-message-box__content {
      padding: 10px 0;
    }
    .el-select {
      margin: 10px 0;
      width: 100%;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }
}
</style>
