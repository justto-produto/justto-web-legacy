<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="preNegotiationDialogVisible"
    title="Pré negociação"
    width="40%"
  >
    <span>Pré negociação</span>
  </el-dialog>
</template>

<script>
export default {
  name: 'PreNegotiationDialog',
  data: () => ({
    preNegotiationDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.preNegotiationDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
