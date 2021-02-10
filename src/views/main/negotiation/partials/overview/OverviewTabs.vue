<template>
  <el-tabs
    v-model="activeTab"
    class="overview-tabs"
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
export default {
  name: 'OverviewTabs',
  data: () => ({
    activeTab: 'parties'
  })
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
