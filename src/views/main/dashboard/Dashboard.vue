<template>
  <jus-view-main class="dashboard-view">
    <template slot="main">
      <el-row>
        <el-col v-loading="loading === 'DISPUTE_STATUS_SUMMARY_WITH_WARN'" :md="12" :sm="24" class="dashboard-view__card">
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
        </el-col>
        <el-col v-loading="loading === 'DISPUTE_AVG_RESPONSE_TIME'" :md="12" :sm="24" class="dashboard-view__card">
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
        </el-col>
        <el-col v-loading="loading === 'MONITORING_DISPUTE_BY_TIME'" :md="12" :sm="24" class="dashboard-view__card">
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
        </el-col>
        <el-col v-loading="loading === 'DISPUTE_MONETARY_SUMMARIES'" :md="12" :sm="24" class="dashboard-view__card">
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
        </el-col>
      </el-row>
    </template>
  </jus-view-main>
</template>

<script>
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
        onClick: this.filter,
        maintainAspectRatio: false
        // legend: {
        //   labels: {
        //     padding: 12
        //   }
        // }
      }
    }
  },
  computed: {
    disputeAvgResponseTime () {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_AVG_RESPONSE_TIME')
      chart = this.format(chart)
      return chart.data
    },
    disputeMonetarySummaries () {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_MONETARY_SUMMARIES')
      chart = this.format(chart)
      return chart.data
    },
    disputeStatusSummaryWithWarn () {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_STATUS_SUMMARY_WITH_WARN')
      chart = this.format(chart)
      return chart.data
    },
    monitoringDisputeByTime () {
      let chart = this.$store.getters.getChartsDatasets('MONITORING_DISPUTE_BY_TIME')
      chart = this.format(chart)
      return chart.data
    },
    chartsDatasets () {
      return this.$store.getters.chartsDatasets
    },
    colors () {
      return this.$store.state.tagModule.colors
    }
  },
  methods: {
    format (chart) {
      if (chart.data && chart.data.datasets) {
        if (chart.name === 'MONITORING_DISPUTE_BY_TIME') {
          chart.data.labels = chart.data.labels.map(l => this.$moment(l).format('DD/MM'))
        }
        for (let dataset of chart.data.datasets) {
          if (chart.type === 'line') {
            dataset.backgroundColor = 'transparent'
            switch (dataset.label) {
              case 'Tempo de resposta médio':
                dataset.borderColor = this.colors[2]
                break
              case 'Concluídos':
                dataset.borderColor = this.colors[4]
                break
              case 'Acordos':
                dataset.borderColor = this.colors[5]
                break
              case 'Perdidos':
                dataset.borderColor = this.colors[1]
                break
            }
          }
        }
      }
      return chart
    },
    reload (chartName) {
      this.loading = chartName
      this.$store.dispatch('getDashboard', chartName).finally(() => {
        setTimeout(() => {
          this.loading = ''
        }, 300)
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
  .el-card__body, .el-row {
    height: 100%
  }
  .el-col {
    height: 50%;
    padding: 10px 20px;
    // border: 1px solid black !important;
  }
  &__dataset {
    width: 100%;
    height: 100%;
  }
  &__card {
    position: relative;
    max-height: 100%;
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
