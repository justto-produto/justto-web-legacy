<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="apiIntegrationDialogVisible"
    title="Integração em API para importação"
    width="40%"
  >
    <span>Integração em API para importação</span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ApiIntegrationDialog',
  data: () => ({
    apiIntegrationDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.apiIntegrationDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
