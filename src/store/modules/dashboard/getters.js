const dashboardGetters = {
  chartsDatasets: state => state.chartsDatasets,
  dashboardSelectedMemberId: state => state.selectedMemberId,
  getChartsDatasets: state => (chartName) => {
    const datasets = state.chartsDatasets.find(cd => cd.name === chartName)
    if (datasets) return JSON.parse(JSON.stringify(datasets))
    return {}
  },
  getNpsSummary: () => {
    return {
      name: 'WORKSPACE_SUMMARIES',
      data: {
        labels: [],
        datasets: [
          { label: 'NPS_PROMOTER_PERCENTAGE', data: [20], width: 25 },
          { label: 'NPS_DETRACTOR_PERCENTAGE', data: [60], width: 25 },
          { label: 'NPS_PASSIVE_PERCENTAGE', data: [20], width: 25 },
          { label: 'UPPER_RANGE_AVG', data: [20045.322962962964], width: 50 },
          { label: 'SETTLED_DEALS_AVG', data: [16451.76160493827], width: 50 },
          { label: 'SAVINGS_TOTAL', data: [291078.47], width: 100 },
          { label: 'SAVINGS_PERCENTAGE', data: [22], width: 100 }
        ]
      },
      options: {}
    }
  }
}

export default dashboardGetters
