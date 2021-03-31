<template>
  <el-dialog
    :title="$t('dialog.title.my-data')"
    :visible.sync="dialogVisible"
    custom-class="edit-user-modal"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <JusEdituser />
  </el-dialog>
</template>

<script>
export default {
  components: {
    JusEdituser: () => import('@/components/layouts/JusEditUser')
  },
  data: () => ({
    dialogVisible: false
  }),
  methods: {
    open() {
      this.dialogVisible = true
    }
  }
}
</script>
