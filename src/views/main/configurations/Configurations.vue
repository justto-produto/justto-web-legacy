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
import { mapGetters } from 'vuex'

export default {
  name: 'Configurations',
  components: {
    WorkspaceData: () => import('./partials/WorkspaceData'),
    Team: () => import('./partials/Team'),
    FeaturesAndModules: () => import('./partials/FeaturesAndModules'),
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu')
  },
  data: () => ({
    activeTab: 'workspace-data'
  }),

  computed: {
    ...mapGetters({
      isJustto: 'isJusttoAdmin'
    }),

    tabs() {
      return [
        {
          name: 'workspace-data',
          label: this.$t('configurations-tabs.workspace-data'),
          component: 'WorkspaceData',
          show: true
        },
        {
          name: 'team',
          label: this.$t('configurations-tabs.team'),
          component: 'Team',
          show: true
        },
        {
          name: 'features-and-modules',
          label: this.$t('configurations-tabs.features-and-modules'),
          component: 'FeaturesAndModules',
          show: true
        }
      ].filter(({ show }) => show)
    }
  }
}
</script>

<style lang="scss" scoped>
.configurations-container {
  margin: 8px 4px 0 28px;
  width: 100%;

  .configurations-container__tabs {
    z-index: -1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .configurations-container__user-menu {
    z-index: 10;
    position: absolute;
    top: 0;
    right: 0;
  }
}

@media (max-width: 1600px) {
  .configurations-container {
    .configurations-container__tabs {
      max-width: 1600px;
      margin: auto;
    }
  }
}

@media (max-width: 900px) {
  .configurations-container {
    margin: 18px;

    .configurations-container__user-menu {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.configurations-container {
  .el-tabs__content {
    flex: 1;
    overflow: auto;

    .el-tab-pane {
      height: 100%;
    }
  }
  .el-tabs__nav {
    .el-tabs__item {
      font-size: 16px;
    }
  }
}
</style>
