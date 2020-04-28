<template>
  <jus-view-main class="dashboard-view">
    <template slot="main">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="reload('DISPUTE_STATUS_SUMMARY_WITH_WARN')">Atualizar</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-bar class="dashboard-view__dataset" ref="line" :data="chartsDatasets[1].data" :options="opt" :type="'horizontalBar'"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="reload('DISPUTE_AVG_RESPONSE_TIME')">Atualizar</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-line class="dashboard-view__dataset" ref="line" :data="chartsDatasets[0].data" :options="opt" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="reload('MONITORING_DISPUTE_BY_TIME')">Atualizar</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-line class="dashboard-view__dataset" ref="line" :data="chartsDatasets[3].data" :options="opt" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="reload('DISPUTE_MONETARY_SUMMARIES')">Atualizar</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-card class="dashboard-view__dataset" :data="chartsDatasets[2].data" />
          </div>
        </el-col>
      </el-row>
      <el-button type="" @click="reload('DISPUTE_AVG_RESPONSE_TIME')">Teste</el-button>
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Dashboard',
  components: {
    JusChartLine: () => import('@/components/charts/JusChartLine'),
    JusChartBar: () => import('@/components/charts/JusChartBar')
  },
  data () {
    return {
      opt: {
        onClick: this.filter
      }
    }
  },
  computed: {
    chartsDatasets () {
      return this.$store.getters.chartsDatasets
    }
  },
  methods: {
    reload (chartName) {
      this.$store.dispatch('getDashboard', chartName)
    },
    filter (event, array) {
      const element = this.$refs.line.getElement(event)
      const filters = (element && element.filter) || null
      if (filters) {
        this.$confirm(
          'Deseja ver as disputas no painel de gerenciamento?',
          'Ir para gerenciamento', {
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            cancelButtonClass: 'is-plain',
            type: 'info'
          }).then(() => {
          this.$store.commit('clearDisputeQuery')
          for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
              this.$store.commit('updateDisputeQuery', { key, value: filters[key] })
            }
          }
          this.$store.commit('setDisputeHasFilters', true)
          this.$store.commit('setDisputesTab', '3')
          this.$router.push('/management')
        })
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard-view {
  .el-card__body {
    height: 100%
  }
  &__dataset {
    width: 100%;
    height: 100%;
  }
}
</style>
