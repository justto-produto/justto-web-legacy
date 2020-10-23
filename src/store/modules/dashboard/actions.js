import axiosDispatcher from '@/store/axiosDispatcher.js'

const dashboardActions = {
  getDashboard({ state, commit }, chartName) {
    let url = 'api/disputes/dashboard?'
    if (chartName) {
      url += `chartName=${chartName}&`
    } else {
      for (const chart of state.charts) {
        url += `chartName=${chart}&`
      }
    }
    if (state.selectedMemberId !== null) {
      url += `memberId=${state.selectedMemberId}&`
    }
    url += 'reload=true'

    return axiosDispatcher({
      url,
      mutation: 'setDashboardDatasets'
    })
  }
}

export default dashboardActions
