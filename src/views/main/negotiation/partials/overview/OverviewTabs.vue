<template>
  <el-tabs
    v-model="activeTab"
    class="overview-tabs"
    @tab-click="updateTab"
  >
    <el-tab-pane name="parties">
      <i
        slot="label"
        class="el-icon-user"
      />
      Partes
    </el-tab-pane>
    <el-tab-pane name="info">
      <i
        slot="label"
        class="el-icon-warning-outline"
      />
      Informações
    </el-tab-pane>
    <el-tab-pane name="properties">
      <i
        slot="label"
        class="el-icon-setting"
      />
      <!-- <DisputeProperties /> -->
    </el-tab-pane>
    <el-tab-pane name="attachments">
      <i
        slot="label"
        class="el-icon-paperclip"
      />
      <!-- <DisputeAttachments
        :is-accepted="false"
        :dispute-id="disputeId"
      /> -->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OverviewTabs',
  data: () => ({
    activeTab: 'parties',
    loadedTabs: ['parties']
  }),
  // components: {
  //   DisputeProperties: () => import('@/views/main/dispute/partials/DisputeProperties'),
  //   DisputeAttachments: () => import('@/views/main/dispute/partials/DisputeOverview/sections/DisputeAttachments'),
  // },
  computed: {
    disputeId() {
      return Number(this.$route.params.id)
    }
  },
  watch: {
    'disputeId'(disputeId) {
      this.loadedTabs = ['parties']
      this.updateTab({ name: this.activeTab })
      this.getTicketOverviewParties(this.disputeId)
    }
  },
  beforeMount() {
    this.getTicketOverviewParties(this.disputeId)
  },
  methods: {
    ...mapActions([
      'getTicketOverviewInfo',
      'getTicketOverviewParties',
      'getTicketOverviewProperties',
      'getTicketOverviewAttachments',
      'updateTicketOverviewActiveTab'
    ]),

    updateTab({ name }) {
      const { disputeId, loadedTabs } = this
      const action = 'getTicketOverview' + this.$options.filters.capitalize(name)

      if (!loadedTabs.includes(name)) {
        this[action](disputeId).then(() => loadedTabs.push(name))
      }
    }
  }
}
</script>

<style lang="scss">
.overview-tabs {
  .el-tabs__header {
    .el-tabs__nav {
      width: 100%;

      .el-tabs__item {
        font-size: 20px;
        padding: 0 6px !important;
        width: 25% !important;
        text-align: center;
      }
    }
  }
}
</style>
