import axiosDispatcher from '@/store/axiosDispatcher.js'
import { DASHBOARD_ONBOARDING_STATUS } from '@/constants/preferences'

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
  },
  getOnboardingStatus({ _ }) {
    return axiosDispatcher({
      url: `api/accounts/my/property/${DASHBOARD_ONBOARDING_STATUS}`,
      mutation: 'setCompletedOnboarding',
    })
  },
  setOnboardingStatus({ commit }, status) {
    axiosDispatcher({
      url: 'api/accounts/my/property',
      method: 'PUT',
      data: {
        [DASHBOARD_ONBOARDING_STATUS]: status,
      },
    })

    commit('setCompletedOnboarding', status)
  },
}

export default actions
