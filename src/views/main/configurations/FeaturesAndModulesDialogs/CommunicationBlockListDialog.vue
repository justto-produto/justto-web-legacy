<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="communicationBlockListDialogVisible"
    title="Lista de bloqueio de endereços"
    width="40%"
  >
    <span>Lista de bloqueio de endereços</span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CommunicationBlockListDialog',
  data: () => ({
    communicationBlockListDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.communicationBlockListDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
