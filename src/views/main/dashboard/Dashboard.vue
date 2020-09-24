<template>
  <jus-view-main
    :key="key"
    class="dashboard-view"
  >
    <template slot="main">
      <div
        v-if="$store.getters.isAdminProfile"
        class="mb10"
      >
        <el-select
          v-model="selectedMemberId"
          filterable
          clearable
          placeholder="Filtrar por membro da equipe"
          @change="getDashboard"
          @clear="selectedMember = null"
        >
          <el-option
            v-for="member in members"
            :key="member.person.id"
            :value="member.person.id"
            :label="member.person.name"
          />
        </el-select>
      </div>
      <el-row :class="{ showFilter: $store.getters.isAdminProfile }">
        <el-col
          v-loading="loading === true || loading === 'DISPUTE_STATUS_SUMMARY_WITH_WARN'"
          :md="14"
          :sm="24"
          class="dashboard-view__graph"
        >
          <div class="dashboard-view__graph-header">
            <div>
              <b>Disputas ativas</b>
              <p>Clique nos números para poder visualizar as disputas.</p>
            </div>
            <el-dropdown
              trigger="click"
              @command="command"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{command: 'reload', param: 'DISPUTE_STATUS_SUMMARY_WITH_WARN'}">
                  <i class="el-icon-refresh" /> Atualizar
                </el-dropdown-item>
                <el-dropdown-item :command="{command: 'switchType', param: 'disputeStatusSummaryWithWarnIsChart'}">
                  <i :class="disputeStatusSummaryWithWarnIsChart ? 'el-icon-notebook-2' : 'el-icon-data-analysis'" /> {{ disputeStatusSummaryWithWarnIsChart ? 'Tabela' : 'Gráfico' }}
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
            class="dashboard-view__dataset"
          />
          <jus-chart-table
            v-else-if="disputeStatusSummaryWithWarn && !disputeStatusSummaryWithWarnIsChart"
            v-loading="loading === true || loading === 'DISPUTE_STATUS_SUMMARY_WITH_WARN'"
            :data="disputeStatusSummaryWithWarn"
            class="dashboard-view__dataset"
          />
          <div
            v-else
            class="dashboard-view__empty"
          >
            {{ emptyMessage }}
          </div>
        </el-col>
        <el-col
          v-loading="loading === true || loading === 'DISPUTE_AVG_RESPONSE_TIME'"
          :md="10"
          :sm="24"
          class="dashboard-view__graph"
        >
          <div class="dashboard-view__graph-header">
            <div>
              <b>Resumo</b>
              <p>Referente a todo o tempo de vida da Equipe.</p>
            </div>
            <el-dropdown
              trigger="click"
              @command="reload"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="DISPUTE_MONETARY_SUMMARIES">
                  <i class="el-icon-refresh" /> Atualizar
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <jus-chart-card
            v-if="disputeMonetarySummaries"
            :data="disputeMonetarySummaries"
            class="dashboard-view__dataset"
          />
          <div
            v-else
            class="dashboard-view__empty"
          >
            {{ emptyMessage }}
          </div>
        </el-col>
        <el-col
          v-loading="loading === true || loading === 'MONITORING_DISPUTE_BY_TIME'"
          :md="24"
          :sm="24"
          class="dashboard-view__graph"
        >
          <div class="dashboard-view__graph-header">
            <div>
              <b>Monitor de disputas</b>
              <p>Referente aos últimos 7 dias. Clique nos números para visualizar as disputas.</p>
            </div>
            <el-dropdown
              trigger="click"
              @command="reload"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="MONITORING_DISPUTE_BY_TIME">
                  <i class="el-icon-refresh" /> Atualizar
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <jus-chart-line
            v-if="monitoringDisputeByTime"
            id="monitoringDisputeByTime"
            ref="monitoringDisputeByTime"
            :data="monitoringDisputeByTime"
            :options="monitoringDisputeByTimeOptions"
            filterable
            class="dashboard-view__dataset"
          />
          <div
            v-else
            class="dashboard-view__empty"
          >
            {{ emptyMessage }}
          </div>
        </el-col>
      </el-row>
      <insert-name
        :is-dialog-visible="isInsertNameOpen"
        @confirm="confirmInsertName"
      />
      <onboarding
        v-if="isOnboardingDialogOpen"
        :steps="steps"
        @closeOnboarding="closeOnboardingDialog"
      />
      <JusTour
        :name="dashboardTour.name"
        :steps="dashboardTour.steps"
        highlight
        :callbacks="dashboardTourCallbacks"
      />
    </template>
  </jus-view-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DASHBOARD_TOUR from './tour'
import { DASHBOARD_TOUR_STATUS } from '@/constants/preferences'

export default {
  name: 'Dashboard',
  components: {
    JusChartLine: () => import('@/components/charts/JusChartLine'),
    JusChartBar: () => import('@/components/charts/JusChartBar'),
    JusChartCard: () => import('@/components/charts/JusChartCard'),
    JusChartTable: () => import('@/components/charts/JusChartTable'),
    InsertName: () => import('./dialogs/InsertName'),
    Onboarding: () => import('@/components/dialogs/Onboarding'),
  },
  data() {
    return {
      key: 0,
      loading: false,
      emptyMessage: 'Não foi possível buscar as informações para exibição do gráfico.',
      disputeStatusSummaryWithWarnIsChart: false,
      opt: {
        onClick: this.filter,
        maintainAspectRatio: false,
      },
      isInsertNameOpen: false,
      isOnboardingDialogOpen: false,
      dashboardTourCallbacks: {
        onFinish: this.dashboardTourOnFinish,
      },
    }
  },
  computed: {
    ...mapGetters([
      'isCompletedOnboarding',
      'hasPersonName',
      'loggedPersonName',
      'userPreferences',
    ]),
    selectedMemberId: {
      get() {
        return this.$store.getters.dashboardSelectedMemberId
      },
      set(memberId) {
        this.$store.commit('setSelectedMemberId', memberId)
      },
    },
    disputeAvgResponseTime() {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_AVG_RESPONSE_TIME')
      chart = this.format(chart)
      return chart.data
    },
    disputeMonetarySummaries() {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_MONETARY_SUMMARIES')
      chart = this.format(chart)
      return chart.data
    },
    disputeStatusSummaryWithWarn() {
      let chart = this.$store.getters.getChartsDatasets('DISPUTE_STATUS_SUMMARY_WITH_WARN')
      chart = this.format(chart)
      return chart.data
    },
    monitoringDisputeByTime() {
      let chart = this.$store.getters.getChartsDatasets('MONITORING_DISPUTE_BY_TIME')
      chart = this.format(chart)
      return chart.data
    },
    monitoringDisputeByTimeOptions() {
      const chart = this.$store.getters.getChartsDatasets('MONITORING_DISPUTE_BY_TIME')
      return Object.assign(this.opt, chart.options)
    },
    chartsDatasets() {
      return this.$store.getters.chartsDatasets
    },
    colors() {
      return this.$store.state.tagModule.colors
    },
    members() {
      return [
        { person: { id: 0, name: 'Todos os negociadores' } },
        ...this.$store.state.workspaceModule.members,
      ]
    },
    steps() {
      return [
        {
          title: `Olá, ${this.loggedPersonName}`,
          description: 'Conhecemos muito bem a rotina de lidar com muitos processos ao mesmo tempo. É monótono, cansativo, trabalhoso e muito propenso a erros que você acaba sendo responsabilizado(a)',
          cta: 'Como a JUSTTO pode me ajudar nisto?',
        },
        {
          title: 'Queremos ser especial para você!',
          description: 'Vamos te ajudar nesta jornada. Você só vai focar no que precisa e é importante. Não se preocupe, tudo que é repetitivo, nós faremos por você. Você está no controle, nós somos o veículo para você fazer mais acordos...',
          cta: 'Justtine, me mostre como faremos isso',
        },
      ]
    },
    dashboardTour() {
      return DASHBOARD_TOUR
    },
    isDashboardTourCompleted() {
      const status = this.userPreferences[DASHBOARD_TOUR_STATUS]

      if (status) {
        return true
      } else {
        return false
      }
    },
  },
  async mounted() {
    await this.getOnboardingStatus()

    if (!this.chartsDatasets.length && this.isCompletedOnboarding) {
      this.getDashboard()
    }

    this.openDashboardTour()

    // this.setOnboardingStatus('false')

    if (!this.hasPersonName) {
      this.isInsertNameOpen = true
    } else {
      this.openOnboardingDialog()
    }
  },
  methods: {
    ...mapActions([
      'getOnboardingStatus',
      'setOnboardingStatus',
      'updateUserPreferences',
    ]),
    getDashboard() {
      this.loading = true
      this.$store.dispatch('getDashboard').catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.key += 1
        this.loading = false
      })
    },
    format(chart) {
      if (chart.data && chart.data.datasets) {
        if (chart.name === 'MONITORING_DISPUTE_BY_TIME') {
          chart.data.labels = chart.data.labels.map(l => this.$moment(l).format('DD/MM'))
        }
        for (const dataset of chart.data.datasets) {
          if (chart.type === 'line') {
            dataset.backgroundColor = 'transparent'
            switch (dataset.label) {
              case 'Geral':
                dataset.borderColor = '#343c4b'
                dataset.pointBackgroundColor = '#343c4b'
                dataset.order = 1
                dataset.borderDash = [3, 3.4]
                break
              case 'E-mail':
                dataset.borderColor = this.colors[3]
                dataset.pointBackgroundColor = this.colors[3]
                break
              case 'WhatsApp':
                dataset.borderColor = this.colors[4]
                dataset.pointBackgroundColor = this.colors[4]
                break
              case 'Plataforma':
                dataset.borderColor = this.colors[2]
                dataset.pointBackgroundColor = this.colors[2]
                break
              case 'SMS':
                dataset.borderColor = this.colors[3]
                dataset.pointBackgroundColor = this.colors[3]
                break
              case 'Concluídos':
                dataset.borderColor = this.colors[4]
                dataset.pointBackgroundColor = this.colors[4]
                break
              case 'Acordos':
                dataset.borderColor = this.colors[5]
                dataset.pointBackgroundColor = this.colors[5]
                break
              case 'Perdidos':
                dataset.borderColor = this.colors[1]
                dataset.pointBackgroundColor = this.colors[1]
                break
              case 'Total':
                dataset.borderColor = '#343c4b'
                dataset.pointBackgroundColor = '#343c4b'
                dataset.order = 1
                dataset.borderDash = [3, 3.4]
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
    reload(chartName) {
      this.loading = chartName
      this.$store.dispatch('getDashboard', chartName).finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 300)
      })
    },
    switchType(type) {
      this[type] = !this[type]
    },
    command(command) {
      this[command.command](command.param)
    },
    filter(event, array) {
      const ref = this.$refs[event.target.parentElement.id]
      const element = ref.getElement(event)
      const filters = (element && element.filters) || null
      if (filters && element.value > 0) {
        this.$store.commit('clearDisputeQuery')
        this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
        for (const key in filters) {
          // eslint-disable-next-line no-prototype-builtins
          if (filters.hasOwnProperty(key)) {
            this.$store.commit('updateDisputeQuery', { key, value: filters[key] })
          }
        }
        if (this.selectedMemberId !== null) {
          this.$store.commit('updateDisputeQuery', { key: 'persons', value: [this.selectedMemberId] })
        }
        this.$store.commit('setDisputeHasFilters', true)
        this.$store.commit('setDisputesTab', '3')
        this.$router.push('/management')
      }
    },
    closeOnboardingDialog() {
      this.isOnboardingDialogOpen = false
      this.setOnboardingStatus('true')
      this.getDashboard()
      this.openDashboardTour()
    },
    openOnboardingDialog() {
      setTimeout(() => {
        this.isOnboardingDialogOpen = !this.isCompletedOnboarding
      }, 2000)
    },
    confirmInsertName() {
      this.isInsertNameOpen = false
      this.openOnboardingDialog()
    },
    openDashboardTour() {
      if (!this.isDashboardTourCompleted) {
        setTimeout(() => {
          this.$tours[this.dashboardTour.name].start()
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dashboard-view {
  .el-card__body {
    padding-bottom: 10px;
  }
  .el-card__body, .el-row {
    height: 100%;
  }
  .showFilter {
    height: calc(100% - 40px);
  }
  .el-col {
    display: flex;
    flex-direction: column;
    height: 50%;
    padding: 10px;
  }
  &__dataset {
    width: 100%;
    height: calc(100% - 48px);
  }
  &__graph-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    .el-dropdown  {
      margin-top: 2px;
      cursor: pointer;
      transform: rotate(90deg);
      height: fit-content;
      &:hover {
        color: $--color-primary;
      }
    }
    b {
      font-size: 18px;
    }
    p {
      font-size: 14px;
      margin-top: 2px;
      margin-bottom: 0;
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
