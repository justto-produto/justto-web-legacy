const getters = {
  chartsDatasets: state => state.chartsDatasets,
  getChartsDatasets: state => (chartName) => {
    if (state.chartsDatasets.length) {
      return JSON.parse(JSON.stringify(state.chartsDatasets.find(cd => cd.name === chartName)))
    }
    return {}
  }
}

export default getters
