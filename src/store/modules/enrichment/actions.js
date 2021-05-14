import { axiosDispatch } from '@/utils'

export default {
  searchLawyers({ commit }, { oabs, name }) {
    commit('cleanSearchedLawyers')
    commit('startSearchLawyerLoading')
    let state = null
    let oabNumber = null
    if (oabs.length) {
      state = oabs[0].state
      oabNumber = oabs[0].number
    }
    return axiosDispatch({
      url: 'api/fusion-runner/search/lawyer',
      params: { oabNumber, state, name },
      mutation: 'setSearchedLawyers'
    })
  },
  hideSearchLawyerLoading({ state }) {
    state.searchLawyersLoading = false
  }
}
