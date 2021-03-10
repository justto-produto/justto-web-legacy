import { axiosDispatch } from '@/utils/'

const disputeApi = '/api/disputes/v2'
const disputeApiLegacy = '/api/disputes'
const officeApi = '/api/office'

const overviewActions = {
  getTicketOverview({ commit }, disputeId) {
    commit('incrementTicketOverviewCountGetters')

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}`,
      mutation: 'setTicketOverview'
    }).finally(() => commit('decrementTicketOverviewCountGetters'))
  },

  getTicketOverviewInfo({ commit }, disputeId) {
    commit('incrementTicketOverviewCountGetters')

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/info`,
      mutation: 'setTicketOverviewInfo'
    }).finally(() => commit('decrementTicketOverviewCountGetters'))
  },

  getTicketOverviewParties({ commit }, disputeId) {
    commit('incrementTicketOverviewCountGetters')

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/parties`,
      mutation: 'setTicketOverviewParties'
    }).finally(() => commit('decrementTicketOverviewCountGetters'))
  },

  getTicketOverviewParty({ commit }, { disputeId, disputeRoleId }) {
    commit('incrementTicketOverviewCountGetters')

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/parties/${disputeRoleId}`,
      mutation: 'setTicketOverviewParty',
      payload: disputeRoleId
    }).finally(() => commit('decrementTicketOverviewCountGetters'))
  },

  getTicketOverviewProperties({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/properties`,
      mutation: 'setTicketOverviewProperties'
    })
  },

  getTicketOverviewAttachments({ _ }, disputeId) {
    return axiosDispatch({
      url: `${officeApi}/disputes/${disputeId}/attachments`,
      mutation: 'setTicketOverviewAttachments'
    })
  },

  getLastTicketOffers({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/last-dispute-offer`,
      mutation: 'setLastTicketOffers'
    })
  },

  setTicketOverview({ _ }, params) {
    const { data, disputeId } = params

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}`,
      method: 'PATCH',
      data,
      mutation: 'updateTicketOverview',
      payload: data || {}
    })
  },

  setTicketOverviewInfo({ _ }, params) {
    const { data, disputeId } = params

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/info`,
      method: 'PATCH',
      data,
      mutation: 'updateTicketOverviewInfo',
      payload: data || {}

    })
  },

  setTicketOverviewParty({ _ }, params) {
    const { disputeId, data } = params
    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles`,
      method: 'PUT',
      data,
      mutation: 'updateTicketOverviewParty'
    })
  },

  deleteTicketOverviewParty({ _ }, { disputeId, roleId }) {
    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/role/${roleId}`,
      method: 'DELETE',
      mutation: 'deleteTicketOverviewParty',
      payload: roleId
    })
  },

  setTicketOverviewPartyPolarity({ _ }, params) {
    const { disputeId, roleId, rolePolarity } = params

    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles/${roleId}/${rolePolarity}`,
      method: 'PATCH'
    })
  },

  setTicketOverviewPartyContact({ _ }, params) {
    const { disputeId, roleId, contactType, contactData } = params

    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles/${roleId}/${contactType}`,
      method: 'PUT',
      data: contactData,
      mutation: 'setTicketOverviewPartyContact',
      payload: params
    })
  },

  deleteTicketOverviewPartyContact({ _ }, params) {
    const { disputeId, roleId, contactId, contactType } = params

    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles/${roleId}/${contactType}/${contactId}`,
      method: 'DELETE',
      mutation: 'deleteTicketOverviewPartyContact',
      payload: params
    })
  },

  updateTicketOverviewPartyContact({ dispatch }, params) {
    dispatch('deleteTicketOverviewPartyContact', params)
      .then(() => dispatch('setTicketOverviewPartyContact', params))
  }
}

export default overviewActions
