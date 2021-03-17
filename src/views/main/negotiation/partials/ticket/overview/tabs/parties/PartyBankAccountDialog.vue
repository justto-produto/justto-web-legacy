<template>
  <el-dialog
    title="Conta bancária"
    :visible.sync="bankAccountDialogVisible"
  >
  </el-dialog>
</template>

<script>
export default {
  name: 'PartyBankAccountsDialog',
  data: () => ({
    bankAccountDialogVisible: false
  }),
  methods: {
    openBankAccountDialog(account) {
      this.bankAccountDialogVisible = true
      console.log(account)
    }
  }
}
</script>

<style>

</style>
