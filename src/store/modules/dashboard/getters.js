const getters = {
  chartsDatasets: state => state.chartsDatasets,
  getChartsDatasets: state => (chartName) => {
    if (state.chartsDatasets.length) {
      const chartDatasets = JSON.parse(JSON.stringify(state.chartsDatasets.find(cd => cd.name === chartName)))
      return chartDatasets && chartDatasets.data ? chartDatasets.data : {}
    }
    return {}
  }
}

export default getters
