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
    <ApiIntegrationForm />
  </el-dialog>
</template>

<script>
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
    apiIntegrationDialogVisible: false
  }),

  methods: {
    async openFeatureDialog() {
      // await this.fetchData()
      this.apiIntegrationDialogVisible = true
    },

    handleClose(fn) {
      fn()
    }
  }
}
</script>

<style>

</style>
