import axiosDispatcher from '@/store/axiosDispatcher.js'

const actions = {
  getWorkspaceTags () {
    return axiosDispatcher({
      url: 'api/workspaces/tags',
      mutation: 'setWorkspaceTags'
    })
  },
  getDisputeTags ({ commit }, disputeId) {
    return axiosDispatcher({
      url: `/api/disputes/${disputeId}/tags`,
      mutation: 'setDisputeTags'
    })
  },
  editDisputeTags ({ commit }, params) {
    return axiosDispatcher({
      method: 'patch',
      url: `/api/disputes/${params.disputeId}/tagss`,
      mutation: 'setDisputeTags',
      data: params.data
    })
  }
}

export default actions
