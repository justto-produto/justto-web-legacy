import DisputesByNegotiatorSumary from '@/models/configurations/DisputesByNegotiatorSumary'

export default {
  getDisputesByNegotiatorSumary: ({ disputesByNegotiatorSumary }) => (personId) => {
    return new DisputesByNegotiatorSumary(disputesByNegotiatorSumary[personId] || {})
  }
}
