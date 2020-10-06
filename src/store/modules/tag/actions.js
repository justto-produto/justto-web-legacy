import axiosDispatcher from '@/store/axiosDispatcher.js'
import { queryBuilder } from '@/utils/jusUtils'

const actions = {
  getWorkspaceTags() {
    return axiosDispatcher({
      url: 'api/workspaces/tags',
      mutation: 'setWorkspaceTags',
      params: { size: 9999, sort: 'id,asc' }
    })
  },
  getDisputeTags({ _ }, disputeId) {
    return axiosDispatcher({
      url: `/api/disputes/${disputeId}/tags`,
      mutation: 'setDisputeTags',
      params: { size: 9999, sort: 'id,desc' }
    })
  },
  editDisputeTags({ _ }, params) {
    return axiosDispatcher({
      method: 'patch',
      url: `/api/disputes/${params.disputeId}/tags`,
      mutation: 'setDisputeTags',
      data: params.data
    })
  },
  getFilteredTags({ rootState }) {
    const query = JSON.parse(JSON.stringify(rootState.disputeModule.query))
    delete query.sort
    delete query.page
    delete query.size
    delete query.tags
    delete query.noTags
    return axiosDispatcher({
      method: 'get',
      url: `/api/disputes/tags${queryBuilder(query)}`,
      mutation: 'setFilteredTags'
    })
  },
  deleteTag({ _ }, tagId) {
    return axiosDispatcher({
      url: `/api/workspaces/tags/${tagId}`,
      method: 'DELETE'
    })
  }
}

export default actions
