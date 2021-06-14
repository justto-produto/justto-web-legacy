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

  getDropLawsuitReasons({ _ }, _payload) {
    const url = `${disputesPath}/outcome-reasons/CANCELED`
    return axiosDispatch({
      url,
      mutation: 'setDropLawsuitReasons'
    })
  },

  setTicketVisualized({ _ }, params) {
    const { disputeId } = params

    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/visualized`,
      method: 'PATCH',
      params,
      mutation: 'setTicketVisualized',
      payload: params
    })
  },

  enrichTicket({ _ }, disputeId) {
    return axiosDispatch({
      url: `api/fusion-runner/enrich/${disputeId}`,
      method: 'PATCH'
    })
  },

  revertStatus({ _ }, params) {
    let { disputeId, action, remove = false } = params
    action = action.toLowerCase().replace('_', '-')
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/${action}`,
      method: 'PATCH',
      payload: { disputeId, remove },
      mutation: 'removeCanceledTicket'
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

  sendTicketAction({ rootState }, params) {
    let { data, action, disputeId } = params
    action = action.toLowerCase()

    const mutations = {
      paused: 'pauseTicket',
      resume: 'resumeTicket',
      negotiators: 'updateTicketNegotiator'
    }

    const payload = { disputeId }

    if (action === 'negotiators') {
      const { negotiatorsId } = data

      payload.negotiatorsId = negotiatorsId

      payload.negotiators = rootState.workspaceModule.workspace.members.filter(({ personId }) => {
        return negotiatorsId.includes(personId)
      })
    }

    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/${action}`,
      method: 'PUT',
      data,
      mutation: mutations[action],
      payload
    })
  },

  deleteTicket({ _ }, { disputeId, reason }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/${reason}`,
      method: 'DELETE',
      mutation: 'deleteTicket',
      payload: disputeId
    })
  },

  cancelTicket({ _ }, payload) {
    const { disputeId } = payload
    return axiosDispatch({
      url: `${disputesPath}/v2/${disputeId}/cancel`,
      method: 'PATCH',
      mutation: 'cancelTicket',
      payload: payload,
      data: payload
    })
  },

  startNegotiation({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/start-negotiation`,
      method: 'PATCH'
    })
  },

  sendOffer({ _ }, { data, disputeId, polarityObjectKey }) {
    return axiosDispatch({
      url: `${disputesPath}/v2/${disputeId}/counterproposal`,
      method: 'POST',
      data,
      mutation: 'updateLastTicketOffers',
      payload: {
        value: data.value,
        polarityObjectKey
      }
    })
  }
}

export default actionsActions
