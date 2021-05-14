import { axiosDispatch } from '@/utils'

const negotiatorApi = 'api/disputes/negotiator'

export default {
  getDisputesByMemberId({ _ }, personId) {
    return axiosDispatch({
      url: `${negotiatorApi}/${personId}/associated`,
      mutation: 'setDisputeSumaryByNegotiator',
      payload: { personId }
    })
  },

  distributeMemberDisputes({ _ }, data) {
    return axiosDispatch({
      url: `${negotiatorApi}/replace`,
      method: 'PATH',
      data
    })
  }
}
