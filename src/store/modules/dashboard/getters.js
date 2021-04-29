const dashboardGetters = {
  chartsDatasets: state => state.chartsDatasets,
  dashboardSelectedMemberId: state => state.selectedMemberId,
  getChartsDatasets: state => (chartName) => {
    const datasets = state.chartsDatasets.find(cd => cd.name === chartName)
    if (datasets) return JSON.parse(JSON.stringify(datasets))
    return {}
  },
  getNpsSummary: state => {
    // const dataset = state.chartsDatasets.find(({ name }) => name === 'WORKSPACE_SUMMARIES')
    // return {
    //   ...dataset,
    //   datasets: [
    //     { label: 'NPS_DETRACTOR_PERCENTAGE', data: [60] },
    //     { label: 'NPS_PASSIVE_PERCENTAGE', data: [20] },
    //     { label: 'NPS_PROMOTER_PERCENTAGE', data: [20] },
    //     ...dataset.datasets
    //   ]
    // }
    return {
      name: 'WORKSPACE_SUMMARIES',
      data: {
        labels: [],
        datasets: [
          { label: 'NPS', data: [80] },
          { label: 'NPS_DETRACTOR_PERCENTAGE', data: [60] },
          { label: 'NPS_PASSIVE_PERCENTAGE', data: [20] },
          { label: 'NPS_PROMOTER_PERCENTAGE', data: [20] },
          { label: 'SETTLED_DEALS_AVG', data: [16451.76160493827] },
          { label: 'UPPER_RANGE_AVG', data: [20045.322962962964] },
          { label: 'SAVINGS_TOTAL', data: [291078.47] },
          { label: 'SAVINGS_PERCENTAGE', data: [22] }
        ]
      },
      options: {}
    }
  }
}

export default dashboardGetters
