<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="draftManagementDialogVisible"
    title="Gestão de minutas"
    append-to-body
    width="75%"
  >
    <Draft />
  </el-dialog>
</template>

<script>
export default {
  name: 'DraftManagementDialog',
  components: {
    Draft: () => import('@/views/adminPanel/partials/PanelMinute')
  },
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
