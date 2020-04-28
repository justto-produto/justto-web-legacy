<template>
  <jus-view-main class="dashboard-view">
    <template slot="main">
      <el-row>
        <el-col :span="12">
          <div v-loading="loading === 'DISPUTE_STATUS_SUMMARY_WITH_WARN'" class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click" @command="reload">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="DISPUTE_STATUS_SUMMARY_WITH_WARN">
                  <i class="el-icon-refresh"/> Atualizar
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-bar ref="line" :data="disputeStatusSummaryWithWarn" :options="opt" :type="'horizontalBar'" class="dashboard-view__dataset"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-loading="loading === 'DISPUTE_AVG_RESPONSE_TIME'" class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click" @command="reload">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="DISPUTE_AVG_RESPONSE_TIME">
                  <i class="el-icon-refresh"/> Atualizar
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-line ref="line" :data="disputeAvgResponseTime" :options="opt" class="dashboard-view__dataset" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-loading="loading === 'MONITORING_DISPUTE_BY_TIME'" class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click" @command="reload">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="MONITORING_DISPUTE_BY_TIME">
                  <i class="el-icon-refresh"/> Atualizar
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-line ref="line" :data="monitoringDisputeByTime" :options="opt" class="dashboard-view__dataset" />
          </div>
        </el-col>
        <el-col :span="12">
          <div v-loading="loading === 'DISPUTE_MONETARY_SUMMARIES'" class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click" @command="reload">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="DISPUTE_MONETARY_SUMMARIES">
                  <i class="el-icon-refresh"/> Atualizar
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-card :data="disputeMonetarySummaries" class="dashboard-view__dataset" />
          </div>
        </el-col>
      </el-row>
    </template>
  </jus-view-main>
</template>

<script>
// import { draw, generate } from 'patternomaly'

export default {
  name: 'Dashboard',
  components: {
    JusChartLine: () => import('@/components/charts/JusChartLine'),
    JusChartBar: () => import('@/components/charts/JusChartBar'),
    JusChartCard: () => import('@/components/charts/JusChartCard')
  },
  data () {
    return {
      loading: '',
      opt: {
        onClick: this.filter
      }
    }
  },
  computed: {
    disputeAvgResponseTime () {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_AVG_RESPONSE_TIME')
      chart = this.generagePattern(chart)
      return chart.data
    },
    disputeMonetarySummaries () {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_MONETARY_SUMMARIES')
      chart = this.generagePattern(chart)
      return chart.data
    },
    disputeStatusSummaryWithWarn () {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_STATUS_SUMMARY_WITH_WARN')
      chart = this.generagePattern(chart)
      return chart.data
    },
    monitoringDisputeByTime () {
      let chart = this.$store.getters.getChartsDatasets('MONITORING_DISPUTE_BY_TIME')
      chart = this.generagePattern(chart)
      return chart.data
    },
    chartsDatasets () {
      return this.$store.getters.chartsDatasets
    }
  },
  methods: {
    generagePattern (chart) {
      // if (chart.data && chart.data.datasets) {
      //   for (let dataset of chart.data.datasets) {
      //     if (chart.type !== 'bar') {
      //       dataset.backgroundColor = [
      //         draw('diamond', '#2ca02c'),
      //         draw('circle', '#ff7f0e'),
      //         draw('zigzag-horizontal', '#17becf')
      //       ]
      //       dataset.borderColor = [
      //         draw('diamond', '#2ca02c'),
      //         draw('circle', '#ff7f0e'),
      //         draw('zigzag-horizontal', '#17becf')
      //       ]
      //     }
      //   }
      // }
      return chart
    },
    reload (chartName) {
      this.loading = chartName
      this.$store.dispatch('getDashboard', chartName).finally(() => {
        this.loading = ''
      })
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
@import '@/styles/colors.scss';

.dashboard-view {
  .el-card__body {
    height: 100%
  }
  &__dataset {
    width: 100%;
    height: 100%;
  }
  &__card {
    position: relative;
  }
  &__menu {
    position: absolute;
    top: 5px;
    right: 5px;
    transform: rotate(90deg);
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
}
</style>
