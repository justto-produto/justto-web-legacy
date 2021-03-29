import { axiosDispatch, buildQuery } from '@/utils'

const tagActions = {
  getWorkspaceTags() {
    return axiosDispatch({
      url: 'api/workspaces/tags',
      mutation: 'setWorkspaceTags',
      params: { size: 9999, sort: 'id,asc' }
    })
  },
  getDisputeTags({ _ }, disputeId) {
    return axiosDispatch({
      url: `/api/disputes/${disputeId}/tags`,
      mutation: 'setDisputeTags',
      params: { size: 9999, sort: 'id,desc' }
    })
  },
  editDisputeTags({ _ }, params) {
    return axiosDispatch({
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
    return axiosDispatch({
      url: `/api/disputes/tags${buildQuery(query)}`,
      mutation: 'setFilteredTags'
    })
  },
  getTicketsFilteredTags({ rootState }) {
    const query = JSON.parse(JSON.stringify(rootState.negotiationTicketsModule.ticketsQuery))
    delete query.sort
    delete query.page
    delete query.size
    delete query.tags
    delete query.noTags
    return axiosDispatch({
      url: `/api/disputes/tags${buildQuery(query)}`,
      mutation: 'setFilteredTags'
    })
  },
  deleteTag({ _ }, tagId) {
    return axiosDispatch({
      url: `/api/workspaces/tags/${tagId}`,
      method: 'DELETE'
    })
  }
}

export default tagActions
