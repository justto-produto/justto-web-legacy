import { axiosDispatch } from '@/utils'

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

    return axiosDispatch({
      url,
      mutation: 'setDashboardDatasets'
    })
  }
}

export default dashboardActions
