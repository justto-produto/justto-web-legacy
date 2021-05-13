import { axiosDispatch } from '@/utils'

const negotiatorApi = 'api/disputes/negotiator'

export default {
  getDisputesByMemberId({ _ }, personId) {
    axiosDispatch({
      url: `${negotiatorApi}/${personId}/associated`,
      mutation: 'setDisputeSumaryByNegotiator',
      payload: { personId }
    })
  }
}
