<template>
  <jus-view-main class="dashboard-view">
    <template slot="main">
      <el-row>
        <el-col v-loading="loading === true || loading === 'DISPUTE_STATUS_SUMMARY_WITH_WARN'" :md="12" :sm="24" class="dashboard-view__graph">
          <div class="dashboard-view__graph-header">
            <span>Titulo do grafico</span>
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
          </div>
          <el-card class="dashboard-view__dataset">
            <jus-chart-bar ref="line" v-if="disputeStatusSummaryWithWarn" :data="disputeStatusSummaryWithWarn" :options="opt" stacked class="dashboard-view__dataset"/>
            <div v-else class="dashboard-view__empty">
              {{ emptyMessage }}
            </div>
          </el-card>
        </el-col>
        <el-col v-loading="loading === true || loading === 'DISPUTE_AVG_RESPONSE_TIME'" :md="12" :sm="24" class="dashboard-view__graph">
          <div class="dashboard-view__graph-header">
            <span>Titulo grafico 2</span>
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
          </div>
          <el-card class="dashboard-view__dataset">
            <jus-chart-line ref="line" v-if="disputeAvgResponseTime" :data="disputeAvgResponseTime" :options="opt" class="dashboard-view__dataset" />
            <div v-else class="dashboard-view__empty">
              {{ emptyMessage }}
            </div>
          </el-card>
        </el-col>
        <el-col v-loading="loading === true || loading === 'MONITORING_DISPUTE_BY_TIME'" :md="12" :sm="24" class="dashboard-view__graph">
          <div class="dashboard-view__graph-header">
            <span>Titulo grafico 3</span>
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
          </div>
          <el-card class="dashboard-view__dataset">
            <jus-chart-line ref="line" v-if="monitoringDisputeByTime" :data="monitoringDisputeByTime" :options="opt" class="dashboard-view__dataset" />
            <div v-else class="dashboard-view__empty">
              {{ emptyMessage }}
            </div>
          </el-card>
        </el-col>
        <el-col v-loading="loading === true || loading === 'DISPUTE_MONETARY_SUMMARIES'" :md="12" :sm="24" class="dashboard-view__graph">
          <div class="dashboard-view__graph-header">
            <span>Titulo cards</span>
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
          </div>
          <jus-chart-card v-if="disputeMonetarySummaries" :data="disputeMonetarySummaries" class="dashboard-view__dataset" />
          <div v-else class="dashboard-view__empty">
            {{ emptyMessage }}
          </div>
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
      emptyMessage: 'Não foi possível buscar as informações para exibição do gráfico.',
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
  created () {
    if (!this.chartsDatasets.length) {
      this.loading = true
      this.$store.dispatch('getDashboard').catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
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
      // console.log(this.$refs.line);
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
    display: flex;
    flex-direction: column;
    height: 50%;
    padding: 10px 18px;
    // border: 1px solid black !important;
  }
  &__dataset {
    width: 100%;
    height: 100%;
    // flex: 1
  }
  // &__graph {
  //   position: relative;
  //   max-height: 100%;
  // }
  &__graph-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px 8px 8px;
    > span {
      font-size: 22px;
      font-weight: bold;
      margin-left: 8px;
    }
  }
  &__menu {
    // position: absolute;
    // top: 5px;
    // right: 5px;
    transform: rotate(90deg);
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
  &__empty {
    display: flex;
    height: 100%;
    align-items: center;
    width: 75%;
    margin: auto;
    text-align: center;
  }
}
</style>
