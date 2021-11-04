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

  revertStatus({ commit }, params) {
    let { disputeId, action, status } = params
    action = action.toLowerCase().replace('_', '-')
    return new Promise((resolve, reject) => {
      axiosDispatch({
        url: `${disputesPath}/${disputeId}/${action}`,
        method: 'PATCH'
      }).then((res) => {
        commit('updateTicketOverview', { payload: { status: status === 'CANCELED' ? 'PRE_NEGOTIATION' : 'RUNNING' } })
        commit('deleteTicket', { payload: disputeId })
        resolve(res)
      }).catch(err => reject(err))
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

  sendTicketAction({ rootState, commit }, params) {
    let { data, action, disputeId } = params
    action = action.toLowerCase()
    const mutations = {
      paused: ['pauseTicket'],
      resume: ['resumeTicket'],
      negotiators: ['updateTicketNegotiator'],
      unsettled: ['updateTicketOverview', 'deleteTicket'],
      settled: ['updateTicketOverview', 'deleteTicket']
    }

    // não remove o ticket se já estiver na ultima aba
    if (rootState.negotiationTicketsModule.ticketsActiveTab === 'finished') {
      mutations.unsettled.pop()
    }

    const payloads = {
      negotiators: [],
      unsettled:
      [
        { payload: { status: 'UNSETTLED' } },
        { payload: disputeId }
      ],
      settled:
      [
        { payload: { status: 'SETTLED' } },
        { payload: disputeId }
      ]
    }

    const payload = { disputeId }

    if (action === 'negotiators') {
      const { negotiatorsId } = data

      payload.negotiatorsId = negotiatorsId

      payload.negotiators = rootState.workspaceModule.workspace.members.filter(({ personId }) => {
        return negotiatorsId.includes(personId)
      })
      payloads.negotiators.push(payload)
    }

    return new Promise((resolve, reject) => {
      axiosDispatch({
        url: `${disputesPath}/${disputeId}/${action}`,
        method: 'PUT',
        data: { ...data, conclusionNote: data.note }
      }).then((res) => {
        if (mutations[action]) {
          const currentAction = mutations[action]
          currentAction.forEach((mutation, index) => {
            if (payloads[action]) {
              const currentPayload = payloads[action][index]
              if (currentPayload) {
                commit(mutation, currentPayload)
              } else {
                commit(mutation)
              }
            } else {
              commit(mutation)
            }
          })
          resolve(res)
        }
      }).catch((res) => {
        reject(res)
      })
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

  cancelTicket({ commit }, payload) {
    const { disputeId } = payload
    return new Promise((resolve, reject) => {
      axiosDispatch({
        url: `${disputesPath}/v2/${disputeId}/cancel`,
        method: 'PATCH',
        mutation: 'cancelTicket',
        payload: payload,
        data: payload
      }).then((res) => {
        commit('updateTicketOverview', { payload: { status: 'CANCELED' } })
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  startNegotiation({ commit }, disputeId) {
    return new Promise((resolve, reject) => {
      axiosDispatch({
        url: `${disputesPath}/${disputeId}/start-negotiation`,
        method: 'PATCH'
      }).then((res) => {
        commit('updateTicketOverview', { payload: { status: 'ENGAGEMENT' } })
        commit('deleteTicket', { payload: disputeId })
        resolve(res)
      }).then((err) => reject(err))
    })
  },

  sendOffer({ commit }, { data, disputeId, polarityObjectKey, change = false }) {
    return new Promise((resolve, reject) => {
      axiosDispatch({
        url: `${disputesPath}/v2/${disputeId}/counterproposal`,
        method: 'POST',
        data
      }).then((res) => {
        commit('updateLastTicketOffers', { payload: { value: data.value, polarityObjectKey } })
        if (change) {
          commit('updateTicketOverview', { payload: { status: 'ACCEPTED' } })
          commit('deleteTicket', { payload: disputeId })
        }
        resolve(res)
      }).catch((res) => {
        reject(res)
      })
    })
  }
}

export default actionsActions
