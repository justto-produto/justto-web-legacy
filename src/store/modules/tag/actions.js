import axiosDispatcher from '@/store/axiosDispatcher.js'
import { queryBuilder } from '@/utils/jusUtils'

const actions = {
  getWorkspaceTags() {
    return axiosDispatcher({
      url: 'api/workspaces/tags',
      mutation: 'setWorkspaceTags',
      params: { size: 99999, sort: 'id,asc' },
    })
  },
  getDisputeTags({ commit }, disputeId) {
    return axiosDispatcher({
      url: `/api/disputes/${disputeId}/tags`,
      mutation: 'setDisputeTags',
      params: { size: 99999, sort: 'id,desc' },
    })
  },
  editDisputeTags({ commit }, params) {
    return axiosDispatcher({
      method: 'patch',
      url: `/api/disputes/${params.disputeId}/tags`,
      mutation: 'setDisputeTags',
      data: params.data,
    })
  },
  getFilteredTags({ rootState }) {
    const query = JSON.parse(JSON.stringify(rootState.disputeModule.query))
    delete query.sort
    delete query.page
    delete query.size
    return axiosDispatcher({
      method: 'get',
      url: `/api/disputes/tags${queryBuilder(query)}`,
      mutation: 'setFilteredTags',
    })
  },
}

export default actions
