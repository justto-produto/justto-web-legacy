<template>
  <el-dialog
    :visible.sync="apiIntegrationDialogVisible"
    append-to-body
    width="40%"
    class="api-integration"
    destroy-on-close
    :before-close="handleClose"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <ApiIntegrationTitle slot="title" />

    <el-skeleton
      v-if="loading"
      animated
    />

    <ApiIntegrationForm
      v-else
      :feature="feature"
      @close="closeFeatureDialog"
      @reset="fetchData"
    />
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ApiIntegrationDialog',

  components: {
    ApiIntegrationForm: () => import('./partials/ApiIntegrationForm'),
    ApiIntegrationTitle: () => import('./partials/ApiIntegrationTitle')
  },

  props: {
    feature: {
      required: true,
      type: Number
    }
  },

  data: () => ({
    apiIntegrationDialogVisible: false,
    loading: false
  }),

  methods: {
    ...mapActions(['getApiIntegrationConfiguration']),

    async openFeatureDialog() {
      await this.fetchData()
      this.apiIntegrationDialogVisible = true
    },

    fetchData() {
      this.loading = true

      this.getApiIntegrationConfiguration(this.feature).catch(error => this.handleClose(() => {
        this.$jusNotification({ error })
      })).finally(() => {
        this.loading = false
      })
    },

    closeFeatureDialog() {
      this.apiIntegrationDialogVisible = false
    },

    handleClose(fn) {
      fn()
    }
  }
}
</script>

<style>

</style>
