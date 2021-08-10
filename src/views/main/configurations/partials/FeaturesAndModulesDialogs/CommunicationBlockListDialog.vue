<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="communicationBlockListDialogVisible"
    title="Lista de bloqueio de endereços"
    append-to-body
    width="50%"
  >
    <ConfigurationBlacklist
      v-if="communicationBlockListDialogVisible"
    />
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CommunicationBlockListDialog',
  components: {
    ConfigurationBlacklist: () => import('@/views/main/configuration/partials/ConfigurationBlacklist')
  },
  data: () => ({
    communicationBlockListDialogVisible: false
  }),
  methods: {
    ...mapActions(['getWorkspace']),

    openFeatureDialog() {
      this.communicationBlockListDialogVisible = true
      this.getWorkspace()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
