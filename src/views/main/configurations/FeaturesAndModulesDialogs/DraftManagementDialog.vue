<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="draftManagementDialogVisible"
    title="Gestão de minutas"
    width="40%"
  >
    <span>Gestão de minutas</span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DraftManagementDialog',
  data: () => ({
    draftManagementDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.draftManagementDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
