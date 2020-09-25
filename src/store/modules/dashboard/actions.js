import axiosDispatcher from '@/store/axiosDispatcher.js'

const actions = {
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
    return axiosDispatcher({ mutation: 'setDashboardDatasets', url })
  }
}

export default actions
