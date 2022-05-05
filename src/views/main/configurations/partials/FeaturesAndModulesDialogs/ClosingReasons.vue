<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    :title="$tc('configurations.CLOSING_REASONS.label')"
    width="60%"
    custom-class="closing-reason-dialog"
    destroy-on-close
    center
    :before-close="handleClose"
  >
    <el-select
      v-model="selectedReasons"
      v-loading="loading"
      placeholder="Selecione os motivos de encerramento"
      multiple
      clearable
      filterable
    >
      <el-option
        v-for="option in allReasons.UNSETTLED"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <span slot="footer">
      <el-button
        size="small"
        @click="visible = false"
      >
        Cancelar
      </el-button>

      <el-button
        size="small"
        type="success"
        @click="handleSaveReasons"
      >Salvar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    visible: false,
    loading: false,
    reasons: {
      UNSETTLED: []
      // ARCHIVED: [],
      // CANCELED: []
    },
    allReasons: { UNSETTLED: [] },
    allReasonsMapped: { UNSETTLED: {} },
    selectedReasons: []
  }),

  methods: {
    ...mapActions([
      'getOutcomeReasonsConfig',
      'getAllOutcomeReasons',
      'setOutcomeReasons'
    ]),

    openFeatureDialog() {
      this.visible = true
      this.loading = true
      this.selectedReasons = []

      Promise.allSettled([
        this.initReasons(),
        this.initAllReasons()
      ]).finally(() => {
        this.loading = false
      })
    },

    async initReasons() {
      return await Object.keys(this.reasons).forEach(async type => {
        this.reasons[type] = []

        this.getOutcomeReasonsConfig(type).then(res => {
          this.reasons[type] = Object.keys(res).map(key => {
            this.selectedReasons = [...this.selectedReasons, key]

            return {
              value: key,
              label: res[key]
            }
          })
        })
      })
    },

    async initAllReasons() {
      return await Object.keys(this.reasons).forEach(async type => {
        this.allReasons[type] = []

        this.getAllOutcomeReasons(type).then(res => {
          this.allReasonsMapped[type] = res

          this.allReasons[type] = Object.keys(res).map(key => ({
            value: key,
            label: res[key]
          }))
        })
      })
    },

    handleClose(done) {
      this.visible = false
      this.selectedReasons = []

      done()
    },

    handleSaveReasons() {
      const reasons = this.selectedReasons.reduce((acc, key) => {
        const temp = {}
        temp[key] = this.allReasonsMapped.UNSETTLED[key]

        return [...acc, temp]
      }, [])

      this.setOutcomeReasons({ type: 'UNSETTLED', reasons }).then(() => {
        this.deleteDocument(this.dispute.id).then(() => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: `${this.$tc('configurations.CLOSING_REASONS.label')} salvos com sucesso`
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.closing-reason-dialog {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
