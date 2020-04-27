import axiosDispatcher from '@/store/axiosDispatcher.js'

const actions = {
  getDashboard ({ state, commit }, chartName) {
    let url = 'api/disputes/dashboard?'
    if (chartName) {
      url += `chartName=${chartName}&`
    } else {
      commit('clearDashboardDatasets')
      for (let chart of state.charts) {
        url += `chartName=${chart}&`
      }
    }
    url += 'reload=true'
    return axiosDispatcher({ mutation: 'setDashboardDatasets', url })
  }
}

export default actions
