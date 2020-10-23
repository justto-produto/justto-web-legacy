import Vue from 'vue'

const dashboardMutations = {
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
  }
}

export default dashboardMutations
