import axiosDispatcher from '@/store/axiosDispatcher.js'

const actions = {
  getDashboard ({ state, commit }, chartName) {
    let url = 'api/disputes/dashboard?'
    if (chartName) {
      url += `chartName=${chartName}&`
      url += 'reload=true'
    } else {
      for (let chart of state.charts) {
        url += `chartName=${chart}&`
      }
    }
    return axiosDispatcher({ mutation: 'setDashboardDatasets', url })
  }
}

export default actions
