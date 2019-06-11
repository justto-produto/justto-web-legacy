<template lang="html">
  <div>
    <div :class="{'active': active}" class="management-actions">
      Casos selecionados: {{ selectedIds.length }}
      <div>
        <el-button plain @click="sendBatchAction('SETTLED')">{{ $t('action.SETTLED') }}</el-button>
        <el-button plain @click="sendBatchAction('UNSETTLED')">{{ $t('action.UNSETTLED') }}</el-button>
        <el-button plain @click="sendBatchAction('PAUSED')">{{ $t('action.PAUSED') }}</el-button>
        <el-button plain @click="sendBatchAction('RESUME')">{{ $t('action.RESUME') }}</el-button>
        <el-button plain @click="sendBatchAction('DELETE')">{{ $t('action.DELETE') }}</el-button>
        <el-button plain @click="sendBatchAction('RESTART_ENGAGEMENT')">{{ $t('action.RESTART_ENGAGEMENT') }}</el-button>
        <!-- <el-button plain @click="sendBatchAction('CHANGE_NEGOTIATOR')">Alterar responsável</el-button> -->
        <!-- <el-button plain @click="sendBatchAction('CHANGE_CAMPAIGN')">Alterar campanha</el-button> -->
      </div>
      <i class="el-icon-close" @click="clearSelection()"/>
    </div>
    <el-dialog
      :visible.sync="chooseUnsettledDialogVisible"
      title="Atenção!"
      class="management-actions__unsettled-dialog"
      width="460px">
      <div class="el-message-box__content">
        <div class="el-message-box__status el-icon-warning"/>
        <div class="el-message-box__message"><p>
          Tem certeza que deseja realizar esta ação?
        </p></div>
      </div>
      <el-select
        v-loading="$store.state.loading"
        v-model="unsettledType"
        placeholder="Escolha o motivo da perda">
        <el-option
          v-for="(type, index) in unsettledTypes"
          :key="index"
          :label="type"
          :value="index" />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseUnsettledDialogVisible = false">Cancelar</el-button>
        <el-button
          :disabled="!unsettledType"
          type="primary"
          @click.prevent="doAction('unsettled')">
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
    },
    tabLabel: {
      type: String,
      default: 'Engajamento'
    }
  },
  data () {
    return {
      chooseUnsettledDialogVisible: false,
      unsettledTypes: [],
      unsettledType: ''
    }
  },
  created () {
    if (this.$store.getters.disputeStatuses.unsettled) {
      this.unsettledTypes = this.$store.getters.disputeStatuses.unsettled
    } else {
      this.$store.dispatch('getDisputeStatuses', 'unsettled').then(response => {
        this.unsettledTypes = response
      }).finally(() => this.$store.dispatch('hideLoading'))
    }
  },
  methods: {
    doAction (action) {
      let params = {
        type: action,
        disputeIds: this.selectedIds
      }
      if (this.unsettledType) {
        params['body'] = { [this.unsettledType]: this.unsettledTypes[this.unsettledType] }
      }
      this.$store.dispatch('sendBatchAction', params).then(response => {
        window.analytics.track('Ação em massa realizada', {
          action: action,
          tab: this.tabLabel,
          selecteds: this.selectedIds.length
        })
        let self = this
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação ' + this.$t('action.' + action) + ' realizada com sucesso.',
          type: 'success',
          onClose () {
            setTimeout(function () {
              self.$jusNotification({
                title: 'Fique atento!',
                message: `Algumas ações em lote podem demorar até serem executadas em nosso sistema.
                Caso sua ação ainda não tenha refletido em seus casos, aguarde um pouco mais e utilize o botão de atualizar os casos.`,
                type: 'info'
              })
            }, 300)
          }
        })
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      })
    },
    sendBatchAction (action) {
      if (action === 'UNSETTLED') {
        this.chooseUnsettledDialogVisible = true
        this.unsettledType = ''
      } else {
        this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
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
  margin: -44px 22px 0;
  transform: translateY(-100%);
  border-radius: 5px 5px 0 0;
  div {
    display: flex;
  }
  &.active {
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
    margin: 0px 22px;
    transform: translateY(0%);
  }
  i {
    cursor: pointer;
    text-align: right;
  }
  button {
    height: 68px;
    padding: 8px 20px;
    border: 0;
    border-radius: 0;
    text-transform: uppercase;
    &:hover {
      background-color: #fafafa !important;
    }
  }
  &__unsettled-dialog {
    .el-message-box__content {
      padding: 10px 0;
    }
    .el-select {
      margin: 10px 0;
      width: 100%;
    }
  }
}
</style>
