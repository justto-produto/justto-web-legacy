<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="apiIntegrationDialogVisible"
    append-to-body
    title="API de integrações"
    width="40%"
    class="api-integration"
    destroy-on-close
    :before-close="handleClose"
  >
    <el-skeleton
      v-if="loading"
      animated
    />
    <ApiIntegrationForm
      v-else
      @close="closeFeatureDialog"
    />
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ApiIntegrationDialog',

  components: {
    ApiIntegrationForm: () => import('./partials/ApiIntegrationForm')
  },

  props: {
    feature: {
      required: true,
      type: Number
    }
  },

  data: () => ({
    apiIntegrationDialogVisible: false,
    loading: false
  }),

  methods: {
    ...mapActions(['getApiIntegrationConfiguration']),

    async openFeatureDialog() {
      await this.fetchData()
      this.apiIntegrationDialogVisible = true
    },

    fetchData() {
      this.loading = true

      this.getApiIntegrationConfiguration(this.feature).then(() => {}).catch(error => this.handleClose(() => {
        this.$jusNotification({ error })
      })).finally(() => {
        this.loading = false
      })
    },

    closeFeatureDialog() {
      this.apiIntegrationDialogVisible = false
    },

    handleClose(fn) {
      fn()
    }
  }
}
</script>

<style>

</style>
