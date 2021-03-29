<template>
  <section class="configurations-container">
    <HeaderUserMenu class="configurations-container__user-menu" />
    <el-tabs
      v-model="activeTab"
      class="configurations-container__tabs"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <component :is="tab.component" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
export default {
  name: 'Configurations',
  components: {
    WorkspaceData: () => import('./WorkspaceData'),
    Team: () => import('./Team'),
    FeaturesAndModules: () => import('./FeaturesAndModules'),
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu')
  },
  data: () => ({
    activeTab: 'workspace-data'
  }),

  computed: {
    tabs() {
      return [
        {
          name: 'workspace-data',
          label: this.$t('configurations-tabs.workspace-data'),
          component: 'WorkspaceData'
        },
        {
          name: 'team',
          label: this.$t('configurations-tabs.team'),
          component: 'Team'
        },
        {
          name: 'features-and-modules',
          label: this.$t('configurations-tabs.features-and-modules'),
          component: 'FeaturesAndModules'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.configurations-container {
  margin: 30px;
  width: 100%;

  .configurations-container__user-menu {
    position: absolute;
    top: 6px;
    right: 30px;
  }
}
</style>

<style lang="scss">
.configurations-container {
  .el-tabs__nav {
    .el-tabs__item {
      font-size: 16px;
    }
  }
}
</style>
