<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="configureCustomizationsDialogVisible"
    title="Lista de bloqueio de endereços"
    append-to-body
    width="50%"
  >
    <span>Here</span>
  </el-dialog>
</template>
<script>
export default {
  name: 'ConfigureCustomizationsDialog',
  data: () => ({
    configureCustomizationsDialogVisible: false
  })
}
</script>
