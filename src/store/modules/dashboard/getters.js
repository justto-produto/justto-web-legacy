const getters = {
  chartsDatasets: state => state.chartsDatasets,
  dashboardSelectedMemberId: state => state.selectedMemberId,
  getChartsDatasets: state => (chartName) => {
    let datasets = state.chartsDatasets.find(cd => cd.name === chartName)
    if (datasets) return JSON.parse(JSON.stringify(datasets))
    return {}
  }
}

export default getters
