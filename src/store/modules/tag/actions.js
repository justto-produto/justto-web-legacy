import axiosDispatcher from '@/store/axiosDispatcher.js'

const actions = {
  getWorkspaceTags () {
    return axiosDispatcher({
      url: 'api/workspaces/tags',
      mutation: 'setWorkspaceTags',
      params: { size: 99999 }
    })
  },
  getDisputeTags ({ commit }, disputeId) {
    return axiosDispatcher({
      url: `/api/disputes/${disputeId}/tags`,
      mutation: 'setDisputeTags',
      params: { size: 99999 }
    })
  },
  editDisputeTags ({ commit }, params) {
    return axiosDispatcher({
      method: 'patch',
      url: `/api/disputes/${params.disputeId}/tags`,
      mutation: 'setDisputeTags',
      data: params.data
    })
  }
}

export default actions
