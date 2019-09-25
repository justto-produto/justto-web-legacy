<template lang="html">
  <div>
    <div :class="{'active': active}" class="management-actions">
      Disputas selecionadas: {{ selectedIds.length }}
      <div>
        <el-button plain data-testid="batch-settled" @click="sendBatchAction('SETTLED')">{{ $t('action.SETTLED') }}</el-button>
        <el-button plain data-testid="batch-unsettled" @click="sendBatchAction('UNSETTLED')">{{ $t('action.UNSETTLED') }}</el-button>
        <el-button plain data-testid="batch-paused" @click="sendBatchAction('PAUSED')">{{ $t('action.PAUSED') }}</el-button>
        <el-button plain data-testid="batch-resume" @click="sendBatchAction('RESUME')">{{ $t('action.RESUME') }}</el-button>
        <el-button plain data-testid="batch-delete" @click="sendBatchAction('DELETE')">{{ $t('action.DELETE') }}</el-button>
        <el-button plain data-testid="batch-restartengagement" @click="sendBatchAction('RESTART_ENGAGEMENT')">{{ $t('action.RESTART_ENGAGEMENT') }}</el-button>
        <!-- <el-button plain @click="sendBatchAction('CHANGE_NEGOTIATOR')">Alterar responsável</el-button> -->
        <!-- <el-button plain @click="sendBatchAction('CHANGE_CAMPAIGN')">Alterar campanha</el-button> -->
      </div>
      <i class="el-icon-close" @click="clearSelection()"/>
    </div>
    <el-dialog
      :visible.sync="chooseUnsettledDialogVisible"
      title="Atenção!"
      class="management-actions__unsettled-dialog"
      width="460px"
      data-testid="unsettled-dialog">
      <div class="el-message-box__content">
        <div class="el-message-box__status el-icon-warning"/>
        <div class="el-message-box__message"><p>
          Tem certeza que deseja realizar esta ação?
        </p></div>
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
      })
    }
  },
  methods: {
    doAction (action) {
      let selecteds = this.selectedIds.length
      let trackTitle
      if (action === 'SETTLED') {
        trackTitle = 'casos ganhos'
      } else if (action === 'unsettled') {
        trackTitle = 'casos perdidos'
      } else if (action === 'PAUSED') {
        trackTitle = 'casos pausados'
      } else if (action === 'RESUME') {
        trackTitle = 'casos despausados'
      } else if (action === 'DELETE') {
        trackTitle = 'casos deletados'
      } else if (action === 'RESTART_ENGAGEMENT') {
        trackTitle = 'engajamentos reiniciados'
      } else {
        trackTitle = 'Ação em massa realizada'
      }
      let params = {
        type: action.toUpperCase(),
        disputeIds: this.selectedIds
      }
      if (this.unsettledType) {
        params['unsettledReasons'] = { [this.unsettledType]: this.unsettledTypes[this.unsettledType] }
      }
      this.$store.dispatch('sendBatchAction', params).then(response => {
        this.chooseUnsettledDialogVisible = false
        window.analytics.track(selecteds + ' ' + trackTitle, {
          action: action,
          selecteds: selecteds
        })
        this.$store.dispatch('getDisputes')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação <strong>' + this.$t('action.' + action.toUpperCase()) + '</strong> realizada com sucesso.',
          type: 'success',
          dangerouslyUseHTMLString: true
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
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar'
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
