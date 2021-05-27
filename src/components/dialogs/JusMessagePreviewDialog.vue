<template>
  <el-dialog
    :visible.sync="isVisible"
    title="Preview"
    width="50%"
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
    ...mapActions(['setShowPreview']),
  }
}
</script>
