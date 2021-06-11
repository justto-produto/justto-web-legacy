<template>
  <el-dialog
    :visible.sync="isVisible"
    title="Preview"
    width="65%"
    custom-class="dialog-preview"
    destroy-on-close
  >
    <div
      class="preview"
      v-html="previewMessage"
    />
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      previewMessage: 'getPreviewMessage',
      showPreview: 'canShowPreview'
    }),

    isVisible: {
      get() {
        return this.showPreview
      },
      set(visibility) {
        this.setShowPreview(visibility)
      }
    }
  },
  methods: {
    ...mapActions(['setShowPreview'])
  }
}
</script>

<style lang="scss">
.dialog-preview {
  .el-dialog__header {
    padding-top: 24px !important;
  }

  .el-dialog__body {
    .preview {
      .image {
        .ck {
          display: none !important;
        }
      }
    }
  }
}
</style>
