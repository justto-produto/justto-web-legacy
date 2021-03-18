import { axiosDispatch } from '@/utils/'

const disputeApi = '/api/disputes/v2'
const oldDisputeApi = 'api/disputes'
const disputeApiLegacy = '/api/disputes'
const officeApi = '/api/office'

const overviewActions = {
  getTicketOverview({ commit, dispatch }, disputeId) {
    commit('incrementTicketOverviewCountGetters')

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}`,
      mutation: 'setTicketOverview'
    })
      .then(({ status }) => dispatch('updateActiveTab', status))
      .finally(() => commit('decrementTicketOverviewCountGetters'))
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

  setTicketOverviewParty({ commit }, params) {
    const { disputeId, data } = params

    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles`,
      method: 'PUT',
      data
    }).then(response => {
      commit('updateTicketOverviewParty', response.date)
      commit('updateTicketItem', response.date)
      return data
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
      method: 'PATCH',
      mutation: 'updateTicketOverviewPartyPolarity',
      payload: params
    })
  },

  setTicketOverviewPartyContact({ _ }, params) {
    const { disputeId, roleId, contactType, contactData } = params

    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles/${roleId}/${contactType}`,
      method: 'PUT',
      data: contactData,
      mutation: 'setTicketOverviewParty',
      payload: roleId
    })
  },

  setTicketRoleBankAccount({ commit }, { bankAccountId, disputeId, personId }) {
    commit('incrementTicketOverviewCountGetters')

    return axiosDispatch({
      url: `${oldDisputeApi}/${disputeId}/bank-accounts/${bankAccountId}`,
      method: 'POST',
      payload: { bankAccountId, personId },
      mutation: 'updateTicketRoleBankAccount'
    }).finally(() => commit('decrementTicketOverviewCountGetters'))
  },

  updateTicketRoleBankAccount({ commit, dispatch, getters }, { disputeId, account, personId }) {
    commit('incrementTicketOverviewCountGetters')

    return new Promise((resolve, reject) => {
      const { id: bankAccountId } = account
      const disputeRole = getters.getTicketOverviewParties.find(el => Number(el.personId) === Number(personId)).legacyDto

      axiosDispatch({
        url: `${oldDisputeApi}/${disputeId}/dispute-roles`,
        method: 'PUT',
        data: {
          ...disputeRole,
          bankAccounts: disputeRole.bankAccounts.map(bankAccount => {
            if (Number(bankAccount.id) !== Number(bankAccountId)) {
              return bankAccount
            } else {
              return account
            }
          })
        }
      }).then(res => {
        dispatch('getTicketOverviewParty', {
          disputeId,
          disputeRoleId: disputeRole.id
        }).then(_ => resolve(res)).catch(err => reject(err))
      }).catch(err => reject(err)).finally(_ => commit('decrementTicketOverviewCountGetters'))
    })
  },

  createTicketRoleBankAccount({ commit, dispatch, getters }, { disputeId, account, personId }) {
    commit('incrementTicketOverviewCountGetters')

    return new Promise((resolve, reject) => {
      const disputeRole = getters.getTicketOverviewParties.find(el => Number(el.personId) === Number(personId)).legacyDto

      axiosDispatch({
        url: `${oldDisputeApi}/${disputeId}/dispute-roles`,
        method: 'PUT',
        data: {
          ...disputeRole,
          bankAccounts: [...disputeRole.bankAccounts, account]
        }
      }).then(
        res => {
          dispatch('getTicketOverviewParty', {
            disputeId,
            disputeRoleId: disputeRole.id
          }).then(_ => resolve(res)).catch(err => reject(err))
        }
      ).catch(err => reject(err)).finally(_ => commit('decrementTicketOverviewCountGetters'))
    })
  },

  // TODO: Pedir uma API para deletar diretamente.
  deleteTicketRoleBankAccount({ commit, dispatch, getters }, { bankAccountId, disputeId, personId }) {
    commit('incrementTicketOverviewCountGetters')

    return new Promise((resolve, reject) => {
      const disputeRole = getters.getTicketOverviewPartie.find(item => Number(item.personId) === Number(personId)).legacyDto
      axiosDispatch({
        url: `${oldDisputeApi}/${disputeId}/dispute-roles`,
        method: 'PUT',
        data: {
          ...disputeRole,
          bankAccounts: disputeRole.bankAccounts.filter(({ id }) => Number(id) !== Number(bankAccountId))
        }
      }).then(
        res => {
          dispatch('getTicketOverviewParty', {
            disputeId,
            disputeRoleId: disputeRole.id
          }).then(_ => resolve(res)).catch(err => reject(err))
        }
      ).catch(err => reject(err)).finally(_ => commit('decrementTicketOverviewCountGetters'))
    })
  },

  unlinkTicketRoleBankAccount({ commit }, { bankAccountId, disputeId, personId }) {
    commit('incrementTicketOverviewCountGetters')

    return axiosDispatch({
      url: `${oldDisputeApi}/${disputeId}/bank-accounts/${bankAccountId}`,
      method: 'DELETE',
      payload: { bankAccountId, personId },
      mutation: 'updateTicketRoleBankAccount'
    }).finally(() => commit('decrementTicketOverviewCountGetters'))
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
