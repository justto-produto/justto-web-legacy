import { axiosDispatch } from '@/utils'

const disputesPath = 'api/disputes'

const managementActions = {
  setActiveactiveOccurrency({ commit, state }, occurrency) {
    commit('setActiveOccurrency', state.activeOccurrency.id === occurrency.id ? {} : occurrency)
  },
  setSelectedIds({ commit }, ids) {
    commit('setSelectedIds', ids)
  },

  getGlobalDisputes({ _ }, data) {
    return axiosDispatch({
      url: `${disputesPath}/management/filter`,
      method: 'POST',
      data
    })
  }
}

export default managementActions
