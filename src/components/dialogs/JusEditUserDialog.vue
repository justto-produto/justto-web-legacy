<template>
  <el-dialog
    :title="$t('dialog.title.my-data')"
    :visible.sync="dialogVisible"
    custom-class="edit-user-modal"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <JusEdituser @close="close" />
  </el-dialog>
</template>

<script>
export default {
  components: {
    JusEdituser: () => import('@/views/main/configurations/partials/EditUser')
  },
  data: () => ({
    dialogVisible: false
  }),
  methods: {
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>
