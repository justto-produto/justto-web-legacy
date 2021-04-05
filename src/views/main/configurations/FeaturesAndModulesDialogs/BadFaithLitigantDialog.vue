<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="badFaithLitigantDialogVisible"
    title="Detecção de ofensores"
    width="40%"
  >
    <span>Detecção de ofensores</span>
  </el-dialog>
</template>

<script>
export default {
  name: 'BadFaithLitigantDialog',
  data: () => ({
    badFaithLitigantDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.badFaithLitigantDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
