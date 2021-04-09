<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="preNegotiationDialogVisible"
    title="Configurações da Pré-Negociação"
    width="50%"
  >
    <PreNegotiation @close="closeFeatureDialog" />
  </el-dialog>
</template>

<script>
export default {
  name: 'PreNegotiationDialog',
  components: {
    PreNegotiation: () => import('@/views/main/configurations/PreNegotiation')
  },
  data: () => ({
    preNegotiationDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.preNegotiationDialogVisible = true
    },
    closeFeatureDialog() {
      this.preNegotiationDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
