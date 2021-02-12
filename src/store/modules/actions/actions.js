import { axiosDispatch } from '@/utils'

const disputesPath = 'api/disputes'

const actionsActions = {
  getOutcomeReasons({ _ }, action) {
    return axiosDispatch({
      url: `${disputesPath}/outcome-reasons/${action}`,
      mutation: 'setOutcomeReasons',
      payload: action
    })
  },

  setVisualized({ _ }, params) {
    const { disputeId } = params

    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/visualized`,
      method: 'PATCH',
      params
    })
  },

  enrichTicket({ _ }, disputeId) {
    return axiosDispatch({
      url: `api/fusion-runner/enrich/${disputeId}`,
      method: 'PATCH'
    })
  },

  revertStatus({ _ }, params) {
    let { disputeId, action } = params
    action = action.toLowerCase().replace('_', '-')

    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/${action}`,
      method: 'PATCH'
    })
  },

  resendMessages({ _ }, disputeId) {
    return axiosDispatch({
      url: `api/messages/resend/${disputeId}`,
      method: 'PUT'
    })
  },

  cancelMessages({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/cancel-messages`,
      method: 'PUT'
    })
  },

  sendTicketAction({ _ }, params) {
    let { data, action, disputeId } = params
    action = action.toLowerCase()

    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/${action}`,
      method: 'PUT',
      data
    })
  },

  deleteTicket({ _ }, params) {
    const { disputeId, reason } = params

    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/${reason}`,
      method: 'DELETE',
      params
    })
  },

  startNegotiation({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/start-negotiation`,
      method: 'PATCH'
    })
  },

  sendOffer({ _ }, params) {
    const { data, disputeId } = params

    return axiosDispatch({
      url: `${disputesPath}/v2/${disputeId}/counterproposal`,
      method: 'POST',
      data
    })
  }
}

export default actionsActions
