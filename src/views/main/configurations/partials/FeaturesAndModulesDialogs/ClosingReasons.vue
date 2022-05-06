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
      allow-create
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
import { uuidv4 } from '@/utils'

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
      'getDisputeStatuses',
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
      this.loading = true

      const reasons = this.selectedReasons.reduce((acc, key) => {
        if (Object.keys(this.allReasonsMapped?.UNSETTLED).includes(key)) {
          acc[key] = this.allReasonsMapped.UNSETTLED[key]
        } else { acc[uuidv4()] = key }

        return acc
      }, {})

      this.setOutcomeReasons({ type: 'UNSETTLED', reasons }).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: `${this.$tc('configurations.CLOSING_REASONS.label')} salvos com sucesso`
        })
        this.getDisputeStatuses('UNSETTLED')
      }).catch(error => this.$jusNotification({ error })).finally(() => {
        this.loading = false
        this.visible = false
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
