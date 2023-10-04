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
      'MONITORING_DISPUTE_BY_TIME'
    ],
    selectedMemberId: null
  },
  mutations,
  actions,
  getters
}

export default dashboardModule
