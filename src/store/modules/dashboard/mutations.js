import Vue from 'vue'

const mutations = {
  setDashboardDatasets (state, chartsDatasets) {
    if (chartsDatasets.length === 1) {
      let chartIndex = state.chartsDatasets.findIndex(c => JSON.stringify(chartsDatasets) === JSON.stringify(c))
      if (chartIndex === -1) state.chartsDatasets.push(chartsDatasets)
      else Vue.set(state.chartsDatasets, chartIndex, chartsDatasets)
    } else {
      state.chartsDatasets = chartsDatasets
    }
  }
}

export default mutations
