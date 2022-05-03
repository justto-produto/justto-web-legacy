<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    :title="$tc('configurations.CLOSING_REASONS.label')"
    width="40%"
    custom-class="closing-reason-dialog"
    destroy-on-close
    :before-close="handleClose"
  >
    <!-- TODO: SAAS-4882 -->
    <el-select
      v-model="selectedReasons"
      placeholder="Selecione os motivos de encerramento"
      multiple
      clearable
      filterable
    >
      <el-option
        v-for="option in reasons.UNSETTLED"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    visible: false,
    reasons: {
      UNSETTLED: [],
      ARCHIVED: [],
      CANCELED: []
    },
    selectedReasons: []
  }),

  methods: {
    ...mapActions(['getOutcomeReasonsConfig']),

    openFeatureDialog() {
      this.visible = true

      Object.keys(this.reasons).forEach(async type => {
        await this.getOutcomeReasonsConfig(type).then(res => {
          this.reasons[type] = Object.keys(res).map(key => {
            this.selectedReasons = [
              ...this.selectedReasons,
              key
            ]

            return {
              value: key,
              label: res[key]
            }
          })
        })
      })
    },

    handleClose(done) {
      this.visible = false
      // this.activeStandartWebhook = false

      // this.formStandartWebhook = {
      //   urlStandartWebhook: '',
      //   userStandartWebhook: '',
      //   passwordStandartWebhook: ''
      // }

      // this.activeWebServiceFinch = false
      // this.formWebServiceFinch = {
      //   urlWebServiceFinch: '',
      //   userWebServiceFinch: '',
      //   passwordWebServiceFinch: ''
      // }

      done()
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
