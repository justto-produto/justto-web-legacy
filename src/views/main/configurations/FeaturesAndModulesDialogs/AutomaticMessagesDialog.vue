<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="automaticMessagesDialogVisible"
    title="Automação de mensagens"
    width="40%"
  >
    <span>Automação de mensagens</span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AutomaticMessagesDialog',
  data: () => ({
    automaticMessagesDialogVisible: false
  }),
  methods: {
    openFeatureDialog() {
      this.automaticMessagesDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
