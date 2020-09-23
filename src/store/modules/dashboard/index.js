import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dashboardModule = {
  state: {
    chartsDatasets: [],
    charts: [
      'DISPUTE_AVG_RESPONSE_TIME',
      'DISPUTE_MONETARY_SUMMARIES',
      'DISPUTE_STATUS_SUMMARY_WITH_WARN',
      'MONITORING_DISPUTE_BY_TIME',
    ],
    selectedMemberId: null,
    isCompletedOnboarding: false,
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
}

export default dashboardModule
