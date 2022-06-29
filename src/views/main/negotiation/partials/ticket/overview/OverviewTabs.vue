<template>
  <el-tabs
    v-model="activeTab"
    class="overview-tabs"
    @tab-click="updateTab"
  >
    <el-tab-pane
      name="parties"
      lazy
    >
      <el-tooltip
        slot="label"
        content="Partes da disputa"
        :open-delay="500"
      >
        <i class="el-icon-user" />
      </el-tooltip>

      <OverviewParties
        @addRecipient="$emit('addRecipient', $event)"
      />
    </el-tab-pane>

    <el-tab-pane
      name="info"
      lazy
    >
      <el-tooltip
        slot="label"
        content="Informações gerais"
        :open-delay="500"
      >
        <i class="el-icon-warning-outline" />
      </el-tooltip>

      <OverviewInfo
        :dispute-mode="disputeMode"
        @dispute="editInfo"
      />
    </el-tab-pane>

    <el-tab-pane
      name="properties"
      lazy
    >
      <el-tooltip
        slot="label"
        content="Propriedades adicionais"
        :open-delay="500"
      >
        <i class="el-icon-setting" />
      </el-tooltip>

      <OverviewProperties />
    </el-tab-pane>

    <el-tab-pane
      name="attachments"
      lazy
    >
      <el-tooltip
        slot="label"
        content="Anexos"
        :open-delay="500"
      >
        <i class="el-icon-paperclip" />
      </el-tooltip>

      <OverviewAttachments />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OverviewTabs',

  components: {
    OverviewAttachments: () => import('./tabs/OverviewAttachments'),
    OverviewProperties: () => import('./tabs/OverviewProperties'),
    OverviewParties: () => import('./tabs/OverviewParties'),
    OverviewInfo: () => import('./tabs/OverviewInfo')
  },

  props: {
    disputeMode: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    activeTab: 'parties',
    loadedTabs: ['parties']
  }),

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
    this.getMyStrategiesLite()
  },

  methods: {
    ...mapActions([
      'getTicketOverviewInfo',
      'getTicketOverviewParties',
      'getTicketOverviewProperties',
      'getTicketOverviewAttachments',
      'updateTicketOverviewActiveTab',
      'getMyStrategiesLite'
    ]),

    updateTab({ name }) {
      const { disputeId, loadedTabs } = this
      const action = 'getTicketOverview' + this.$options.filters.capitalize(name)

      if (!loadedTabs.includes(name)) {
        this[action](disputeId).then(() => loadedTabs.push(name))
      }
    },

    editInfo() {
      this.$emit('edit:dispute')
    }
  }
}
</script>

<style lang="scss">
.overview-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .el-tabs__content {
    overflow: hidden;
    flex: 1;

    .el-tab-pane {
      height: 100%;
      padding: 0;
    }
  }

  .el-tabs__header {
    margin: 0 0 8px;

    .el-tabs__nav {
      width: 100%;

      .el-tabs__item {
        font-size: 20px;
        padding: 0 !important;
        width: 25% !important;
        text-align: center;
      }
    }
  }
}
</style>
