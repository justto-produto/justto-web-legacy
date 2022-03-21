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
    Feature em desenvolvimento.
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    visible: false,
    reasons: {}
  }),

  methods: {
    ...mapActions(['getOutcomeReasonsConfig']),

    openFeatureDialog() {
      this.visible = true;

      ['UNSETTLED', 'ARCHIVED', 'CANCELED'].forEach(async type => {
        await this.getOutcomeReasonsConfig(type).then(res => {
          this.reasons[type] = Object.keys(res).map(key => {
            const temp = {}
            temp[key] = res[key]

            return temp
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
