import Vue from 'vue'
import { DASHBOARD_ONBOARDING_STATUS } from '@/constants/preferences'

const mutations = {
  setDashboardDatasets(state, chartsDatasets) {
    if (chartsDatasets.length === 1) {
      const chartIndex = state.chartsDatasets.findIndex(c => c.name === chartsDatasets[0].name)
      if (chartIndex === -1) state.chartsDatasets.push(chartsDatasets[0])
      else Vue.set(state.chartsDatasets, chartIndex, chartsDatasets[0])
    } else {
      state.chartsDatasets = chartsDatasets
    }
  },
  setSelectedMemberId(state, selectedMemberId) {
    state.selectedMemberId = selectedMemberId
  },
  clearDashboard(state) {
    state.chartsDatasets = []
    state.selectedMemberId = null
  },
  setCompletedOnboarding(state, status) {
    if (status[DASHBOARD_ONBOARDING_STATUS]) {
      status = status[DASHBOARD_ONBOARDING_STATUS]
    }

    if (typeof status === 'string') {
      if (status === 'true') {
        state.isCompletedOnboarding = true
      } else {
        state.isCompletedOnboarding = false
      }
    } else {
      state.isCompletedOnboarding = status
    }
  },
}

export default mutations
