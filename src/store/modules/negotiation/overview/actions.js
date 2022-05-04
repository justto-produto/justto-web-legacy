import { axiosDispatch, validateCurrentId } from '@/utils/'

const disputeApi = '/api/disputes/v2'
const disputeApiLegacy = '/api/disputes'
const officeApi = '/api/office'
const spiderApi = '/api/spider'
const fusionRunnerApi = '/api/fusion-runner'

const overviewActions = {
  getTicketOverview({ commit, dispatch }, disputeId) {
    commit('incrementTicketOverviewCountGetters')

    return validateCurrentId(disputeId, () => {
      return new Promise((resolve, reject) => {
        axiosDispatch({
          url: `${disputeApi}/${disputeId}`,
          mutation: 'setTicketOverview'
        }).then((res) => {
          resolve(res)
          dispatch('updateActiveTab', res.status)
        }).catch(error => reject(error)).finally(() => commit('decrementTicketOverviewCountGetters'))
      })
    })
  },

  getContactBlockReason({ _ }, { disputeId, blockedType, addressType, contactId }) {
    return validateCurrentId(disputeId, () => {
      return axiosDispatch({
        url: `${disputeApiLegacy}/${disputeId}/contact/${blockedType}/${addressType}/${contactId}`
      })
    })
  },

  getTicketOverviewInfo({ commit }, disputeId) {
    commit('incrementTicketOverviewCountGetters')

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}/info`,
      mutation: 'setTicketOverviewInfo'
    }).finally(() => commit('decrementTicketOverviewCountGetters')))
  },

  getTicketOverviewParties({ commit }, disputeId) {
    commit('incrementTicketOverviewCountGetters')

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}/parties`,
      mutation: 'setTicketOverviewParties'
    }).finally(() => commit('decrementTicketOverviewCountGetters')))
  },

  getTicketOverviewParty({ commit }, { disputeId, disputeRoleId }) {
    commit('incrementTicketOverviewCountGetters')

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}/parties/${disputeRoleId}`,
      mutation: 'setTicketOverviewParty',
      payload: disputeRoleId
    }).finally(() => commit('decrementTicketOverviewCountGetters')))
  },

  getTicketOverviewProperties({ _ }, disputeId) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}/properties`,
      mutation: 'setTicketOverviewProperties'
    }))
  },

  getTicketOverviewAttachments({ _ }, disputeId) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${officeApi}/disputes/${disputeId}/attachments`,
      mutation: 'setTicketOverviewAttachments'
    }))
  },

  getLastTicketOffers({ _ }, disputeId) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}/last-dispute-offer`,
      mutation: 'setLastTicketOffers'
    }))
  },

  getTicketMetadata({ _ }, disputeId) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${officeApi}/documents/dispute/${disputeId}/metadata`,
      mutation: 'setTicketMetadata'
    }))
  },

  getAssociatedContacts({ _ }, disputeId) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}/properties`,
      mutation: 'setAssociatedContacts'
    }))
  },

  setTicketOverview({ _ }, params) {
    const { data, disputeId } = params
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}`,
      method: 'PATCH',
      data,
      mutation: 'updateTicketOverview',
      payload: data || {}
    }))
  },

  setTicketOverviewDefendantProposal({ _ }, params) {
    const { data, disputeId, polarityObjectKey } = params
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}`,
      method: 'PATCH',
      data,
      mutation: 'updateLastTicketOffers',
      payload: {
        value: data.value,
        polarityObjectKey
      }
    }))
  },

  setTicketOverviewInfo({ _ }, params) {
    const { data, disputeId } = params
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApi}/${disputeId}/info`,
      method: 'PATCH',
      data,
      mutation: 'updateTicketOverviewInfo',
      payload: data || {}
    }))
  },

  async setTicketOverviewParty({ commit }, { disputeId, data, isNew = false }) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles`,
      method: 'PUT',
      data
    }).then(response => {
      if (!isNew) {
        response.disputeId |= disputeId
        commit('updateTicketOverviewParty', response)
        commit('updateTicketItemFromDisputeRole', response)
      } else {
        commit('setNewTicketOverviewParty', response)
      }
      return data
    }))
  },

  deleteTicketOverviewParty({ _ }, { disputeId, roleId, cancelPropagation = false }) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/role/${roleId}`,
      method: 'DELETE',
      mutation: 'deleteTicketOverviewParty',
      params: { cancelPropagation },
      payload: roleId
    }))
  },

  setTicketOverviewPartyPolarity({ _ }, params) {
    const { disputeId, roleId, rolePolarity } = params

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles/${roleId}/${rolePolarity}`,
      method: 'PATCH',
      mutation: 'updateTicketOverviewPartyPolarity',
      payload: params
    }))
  },

  setTicketRoleBankAccount({ commit }, { bankAccountId, disputeId, personId }) {
    commit('incrementTicketOverviewCountGetters')

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/bank-accounts/${bankAccountId}`,
      method: 'POST',
      payload: { bankAccountId, personId, link: true },
      mutation: 'updateTicketRoleBankAccount'
    }).finally(() => commit('decrementTicketOverviewCountGetters')))
  },

  updateTicketRoleBankAccount({ commit, dispatch, getters }, { disputeId, account, personId }) {
    commit('incrementTicketOverviewCountGetters')

    return new Promise((resolve, reject) => {
      const { id: bankAccountId } = account
      const disputeRole = getters.getTicketOverviewParties.find(el => Number(el.person.id) === Number(personId)).legacyDto

      axiosDispatch({
        url: `${disputeApiLegacy}/${disputeId}/dispute-roles`,
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
      const disputeRole = getters.getTicketOverviewParties.find(el => Number(el.person.id) === Number(personId)).legacyDto

      axiosDispatch({
        url: `${disputeApiLegacy}/${disputeId}/dispute-roles`,
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
      const disputeRole = getters.getTicketOverviewParties.find(item => Number(item.person.id) === Number(personId)).legacyDto

      axiosDispatch({
        url: `${disputeApiLegacy}/${disputeId}/dispute-roles`,
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
      url: `${disputeApiLegacy}/${disputeId}/bank-accounts/${bankAccountId}`,
      method: 'DELETE',
      payload: { bankAccountId, personId, link: false },
      mutation: 'updateTicketRoleBankAccount'
    }).finally(() => commit('decrementTicketOverviewCountGetters'))
  },

  setTicketOverviewPartyContact({ _ }, params) {
    const { disputeId, roleId, contactType, contactData } = params

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles/${roleId}/${contactType}`,
      method: 'PUT',
      data: contactData,
      mutation: 'setTicketOverviewParty',
      payload: roleId
    }))
  },

  deleteTicketOverviewPartyContact({ _ }, params) {
    const { disputeId, roleId, contactId, contactType } = params

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/dispute-roles/${roleId}/${contactType}/${contactId}`,
      method: 'DELETE',
      mutation: 'deleteTicketOverviewPartyContact',
      payload: params
    }))
  },

  updateTicketOverviewPartyContact({ dispatch }, params) {
    dispatch('deleteTicketOverviewPartyContact', params).then(() => {
      dispatch('setTicketOverviewPartyContact', params).then(() => {
        const { disputeId, roleId: disputeRoleId } = params

        dispatch('getTicketOverviewParty', { disputeId, disputeRoleId })
      })
    })
  },

  favoriteTicket({ _ }, disputeId) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/favorite`,
      method: 'PUT',
      mutation: 'toggleFavoriteTicket',
      payload: { disputeId, favorite: true }
    }))
  },

  disfavorTicket({ _ }, disputeId) {
    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/disfavor`,
      method: 'PUT',
      mutation: 'toggleFavoriteTicket',
      payload: { disputeId, favorite: false }
    }))
  },

  searchNamesakeTicketOptions({ _ }, name) {
    return axiosDispatch({
      url: `${spiderApi}/search/name/${name}`
    })
  },

  setNamesakeTicketOptions({ _ }, { personId, document, disputeId }) {
    return axiosDispatch({
      url: `${fusionRunnerApi}/set-document/person/${personId}/${document}/${disputeId}`,
      method: 'PATCH',
      mutation: 'setNamesake',
      payload: { personId, document, disputeId }
    })
  },

  setTicketOverviewAttachmentConfidentiality({ _ }, { disputeId, attach: { id, confidential } }) {
    return axiosDispatch({
      url: `${officeApi}/disputes/${disputeId}/attachment/${id}/confidential/${!confidential}`,
      method: 'PATCH',
      mutation: 'setAttachmentConfidentiality',
      payload: { id }
    })
  }
}

export default overviewActions
