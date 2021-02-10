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
      Propriedades
    </el-tab-pane>
    <el-tab-pane name="attachments">
      <i
        slot="label"
        class="el-icon-paperclip"
      />
      Anexos
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OverviewTabs',
  data: () => ({
    activeTab: 'parties'
  }),
  computed: {
    ...mapGetters({
      ticketOverviewActiveTab: 'getTicketOverviewActiveTab'
    }),
    disputeId() {
      return this.$route.params.id
    }
  },
  watch: {
    'disputeId'(disputeId) {
      this.updateTab({ name: this.activeTab })
      this.getTicketOverviewParties(this.disputeId)
    }
  },
  beforeMount() {
    this.activeTab = this.ticketOverviewActiveTab
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
      const action = 'getTicketOverview' + this.$options.filters.capitalize(name)
      this.updateTicketOverviewActiveTab(name)
      this[action](this.disputeId)
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
