const mutations = {
  setDashboardDatasets (state, chartsDatasets) {
    if (state.chartsDatasets.length) {
      let chartIndex = state.chartsDatasets.findIndex(c => JSON.stringify(chartsDatasets) === JSON.stringify(c))
      Vue.set(state.chartsDatasets, chartIndex, chartsDatasets)
    } else {
      state.chartsDatasets = chartsDatasets
    }
  },
  clearDashboardDatasets (state) {
    state.chartsDatasets = []
  }
}

export default mutations
