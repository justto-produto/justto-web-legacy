<template>
  <jus-view-main :key="key" class="dashboard-view">
    <template slot="main">
      <el-row>
        <el-col v-loading="loading === true || loading === 'DISPUTE_STATUS_SUMMARY_WITH_WARN'" :md="14" :sm="24" class="dashboard-view__graph">
          <div class="dashboard-view__graph-header">
            <span>Disputas ativas</span>
            <el-dropdown class="dashboard-view__menu" trigger="click" @command="command">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{command: 'reload', param: 'DISPUTE_STATUS_SUMMARY_WITH_WARN'}">
                  <i class="el-icon-refresh"/> Atualizar
                </el-dropdown-item>
                <el-dropdown-item :command="{command: 'switchType', param: 'disputeStatusSummaryWithWarnIsChart'}" >
                  <i :class="disputeStatusSummaryWithWarnIsChart ? 'el-icon-notebook-2' : 'el-icon-data-analysis'"/> {{ disputeStatusSummaryWithWarnIsChart ? 'Tabela' : 'Gráfico' }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <jus-chart-bar
            v-if="disputeStatusSummaryWithWarn && disputeStatusSummaryWithWarnIsChart"
            id="disputeStatusSummaryWithWarn"
            ref="disputeStatusSummaryWithWarn"
            :data="disputeStatusSummaryWithWarn"
            :options="opt"
            stacked
            class="dashboard-view__dataset disputeStatusSummaryWithWarn"/>
          <jus-chart-table
            v-loading="loading === true || loading === 'DISPUTE_STATUS_SUMMARY_WITH_WARN'"
            v-else-if="disputeStatusSummaryWithWarn && !disputeStatusSummaryWithWarnIsChart"
            :data="disputeStatusSummaryWithWarn" />
          <div v-else class="dashboard-view__empty">
            {{ emptyMessage }}
          </div>
        </el-col>
        <el-col v-loading="loading === true || loading === 'DISPUTE_AVG_RESPONSE_TIME'" :md="10" :sm="24" class="dashboard-view__graph pt0">
          <div v-if="$store.getters.isAdminProfile" class="mb20">
            <el-select
              v-model="selectedMemberId"
              filterable
              clearable
              placeholder="Filtrar por membro da equipe"
              @change="getDashboard"
              @clear="selectedMember = ''">
              <el-option
                v-for="member in members"
                :key="member.person.id"
                :value="member.person.id"
                :label="member.person.name"/>
            </el-select>
          </div>
          <div class="dashboard-view__graph-header">
            <span>Tempo de resposta médio</span>
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
          <jus-chart-line
            v-if="disputeAvgResponseTime"
            id="disputeAvgResponseTime"
            ref="disputeAvgResponseTime"
            :data="disputeAvgResponseTime"
            :options="opt"
            :legends="false"
            class="dashboard-view__dataset" />
          <div v-else class="dashboard-view__empty">
            {{ emptyMessage }}
          </div>
        </el-col>
        <el-col v-loading="loading === true || loading === 'MONITORING_DISPUTE_BY_TIME'" :md="16" :sm="24" class="dashboard-view__graph">
          <div class="dashboard-view__graph-header">
            <span>Monitor de disputas</span>
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
          <jus-chart-line
            v-if="monitoringDisputeByTime"
            id="monitoringDisputeByTime"
            ref="monitoringDisputeByTime"
            :data="monitoringDisputeByTime"
            :options="opt"
            class="dashboard-view__dataset" />
          <div v-else class="dashboard-view__empty">
            {{ emptyMessage }}
          </div>
        </el-col>
        <el-col v-loading="loading === true || loading === 'DISPUTE_MONETARY_SUMMARIES'" :md="8" :sm="24" class="dashboard-view__graph">
          <div class="dashboard-view__graph-header">
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
          <jus-chart-card
            v-if="disputeMonetarySummaries"
            :data="disputeMonetarySummaries"
            class="dashboard-view__dataset" />
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
    JusChartCard: () => import('@/components/charts/JusChartCard'),
    JusChartTable: () => import('@/components/charts/JusChartTable')
  },
  data () {
    return {
      key: 0,
      loading: false,
      emptyMessage: 'Não foi possível buscar as informações para exibição do gráfico.',
      disputeStatusSummaryWithWarnIsChart: false,
      opt: {
        onClick: this.filter,
        maintainAspectRatio: false,
        legend: {
          reverse: true
        }
      }
    }
  },
  computed: {
    selectedMemberId: {
      get () {
        return this.$store.getters.dashboardSelectedMemberId
      },
      set (memberId) {
        this.$store.commit('setSelectedMemberId', memberId)
      }
    },
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
    },
    members () {
      return this.$store.state.workspaceModule.members
    }
  },
  created () {
    if (!this.chartsDatasets.length) {
      this.getDashboard()
    }
  },
  methods: {
    getDashboard () {
      this.loading = true
      this.$store.dispatch('getDashboard').catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.key += 1
        this.loading = false
      })
    },
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
          if (chart.type === 'bar') {
            switch (dataset.label) {
              case 'Sem Alerta':
                dataset.backgroundColor = this.colors[3] + 'd9'
                dataset.order = 1
                break
              case 'Com Alerta':
                dataset.backgroundColor = this.colors[2] + 'd9'
                dataset.order = 2
                break
              case 'Total':
                dataset.backgroundColor = 'transparent'
                dataset.borderColor = '#343c4b'
                dataset.order = 0
                dataset.borderDash = [3, 3.4]
                dataset.type = 'line'
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
          this.loading = false
        }, 300)
      })
    },
    switchType (type) {
      this[type] = !this[type]
    },
    command (command) {
      this[command.command](command.param)
    },
    filter (event, array) {
      const ref = this.$refs[event.target.parentElement.id]
      const element = ref.getElement(event)
      const filters = (element && element.filters) || null
      if (filters) {
        this.$store.commit('clearDisputeQuery')
        this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
        for (let key in filters) {
          if (filters.hasOwnProperty(key)) {
            this.$store.commit('updateDisputeQuery', { key, value: filters[key] })
          }
        }
        if (this.selectedMemberId) {
          this.$store.commit('updateDisputeQuery', { key: 'persons', value: [this.selectedMemberId] })
        }
        this.$store.commit('setDisputeHasFilters', true)
        this.$store.commit('setDisputesTab', '3')
        this.$router.push('/management')
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
    padding: 10px;
  }
  &__dataset {
    width: 100%;
    height: 100%;
  }
  &__graph-header {
    padding: 0 8px 8px 8px;
    > span {
      font-size: 18px;
      font-weight: bold;
    }
  }
  &__menu {
    float: right;
    margin-top: 2px;
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
  .el-select {
    width: 100%;
  }
}
</style>
