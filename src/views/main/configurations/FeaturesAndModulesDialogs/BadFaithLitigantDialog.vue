<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="badFaithLitigantDialogVisible"
    title="Detecção de ofensores"
    width="50%"
  >
    <BadFaithLitigant @close="closeFeatureDialog" />
  </el-dialog>
</template>

<script>
export default {
  name: 'BadFaithLitigantDialog',
  components: {
    BadFaithLitigant: () => import('@/views/main/configurations/BadFaithLitigant')
  },
  data: () => ({
    badFaithLitigantDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.badFaithLitigantDialogVisible = true
    },
    closeFeatureDialog() {
      this.badFaithLitigantDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
