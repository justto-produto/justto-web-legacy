import Vue from 'vue'

const mutations = {
  setDashboardDatasets (state, chartsDatasets) {
    if (chartsDatasets.length === 1) {
      let chartIndex = state.chartsDatasets.findIndex(c => JSON.stringify(chartsDatasets) === JSON.stringify(c))
      if (chartIndex === -1) state.chartsDatasets.push(chartsDatasets[0])
      else Vue.set(state.chartsDatasets, chartIndex, chartsDatasets[0])
    } else {
      state.chartsDatasets = chartsDatasets
    }
  },
  setSelectedMemberId (state, selectedMemberId) {
    state.selectedMemberId = selectedMemberId
  },
  clearDashboard (state) {
    state.chartsDatasets = []
    state.selectedMemberId = null
  }
}

export default mutations
