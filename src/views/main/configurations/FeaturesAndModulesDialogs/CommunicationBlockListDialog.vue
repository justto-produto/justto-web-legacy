<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="communicationBlockListDialogVisible"
    title="Lista de bloqueio de endereços"
    append-to-body
    width="50%"
  >
    <!-- <span>Lista de bloqueio de endereços</span> -->
    <ConfigurationBlacklist />
  </el-dialog>
</template>

<script>
export default {
  name: 'CommunicationBlockListDialog',
  components: {
    ConfigurationBlacklist: () => import('@/views/main/configuration/partials/ConfigurationBlacklist')
  },
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
