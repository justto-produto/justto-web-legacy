import Vue from 'vue'
import TicketOverview from '@/models/negotiations/overview/TicketOverviewVm'
import TicketOverviewInfo from '@/models/negotiations/overview/TicketOverviewInfoVm'
import TicketOverviewParties from '@/models/negotiations/overview/TicketOverviewPartiesVm'
import TicketOverviewLastOffers from '@/models/negotiations/overview/TicketOverviewLastOfferVm'

const findPartyById = (parties, roleId) => {
  const partyIndex = parties.findIndex(party => party.disputeRoleId === roleId)
  return parties[partyIndex]
}

const findContactIndex = (contactTypeList, contactId) => {
  return contactTypeList.findIndex(constact => constact.id === contactId)
}

const overviewMutations = {
  setTicketOverview: (state, params) => Vue.set(state, 'ticketOverview', new TicketOverview(params)),

  updateTicketOverview: (state, { payload }) => {
    for (const key of Object.keys(payload)) {
      Vue.set(state.ticketOverview, key, payload[key])
    }
    if (payload.defendantProposal) {
      const offerObj = {
        name: payload.defendantProposal.name,
        roleId: payload.defendantProposal.lastOfferRoleId,
        value: payload.defendantProposal.value
      }
      Vue.set(state.ticketOverview, 'upperRange', payload.defendantProposal.value)
      Vue.set(state.lastTicketOffers, 'defendantOffer', offerObj)
    }
  },

  setTicketOverviewInfo: (state, params) => {
    Vue.set(state, 'ticketOverviewInfo', params)
  },

  updateTicketOverviewInfo: ({ ticketOverviewInfo }, { payload }) => {
    for (const key of Object.keys(payload)) {
      Vue.set(ticketOverviewInfo, key, payload[key])
    }
  },

  setAssociatedContacts: (state, properties) => {
    const value = properties['CONTATOS ASSOCIADOS'] || 'NAO'
    if (value) {
      Vue.set(state, 'haveAssociatedContacts', value)
    }
  },

  setTicketMetadata: (state, metadata) => {
    Vue.set(state, 'ticketMetadata', metadata)
  },

  setTicketOverviewParties: (state, params) => Vue.set(state, 'ticketOverviewParties', params),

  setTicketOverviewParty: ({ ticketOverviewParties }, { data, payload }) => {
    const partyToSet = findPartyById(ticketOverviewParties, payload)
    Vue.set(partyToSet, 'emailsDto', data.emails)
    Vue.set(partyToSet, 'phonesDto', data.phones)
    Vue.set(partyToSet, 'oabsDto', data.oabs)
    Vue.set(partyToSet, 'birthday', data.birthday)
    Vue.set(partyToSet, 'bankAccountsDto', data.bankAccounts)
    Vue.set(partyToSet, 'legacyDto', data) // TODO: Remover
  },

  setNewTicketOverviewParty: (state, response) => {
    const { id, documentNumber, name, oabs, personId, party, roles } = response
    const newTicketOverviewParty = {
      disputeRoleId: id,
      documentNumber,
      name,
      oabs,
      personId,
      polarity: party,
      roles,
      status: 'OFFLINE'
    }
    Vue.set(state.ticketOverviewParties, state.ticketOverviewParties.length, newTicketOverviewParty)
  },

  updateTicketOverviewParty: ({ ticketOverviewParties }, params) => {
    const {
      id,
      name,
      birthday,
      bankAccounts,
      documentNumber
    } = params
    const partyToSet = findPartyById(ticketOverviewParties, id)

    Vue.set(partyToSet, 'name', name)
    Vue.set(partyToSet, 'birthday', birthday)
    Vue.set(partyToSet, 'bankAccountsDto', bankAccounts)
    Vue.set(partyToSet, 'documentNumber', documentNumber)
    Vue.set(partyToSet, 'legacyDto', params)
  },

  updateTicketOverviewPartyPolarity: ({ ticketOverviewParties }, { payload }) => {
    const { roleId, rolePolarity } = payload
    const partyToSet = findPartyById(ticketOverviewParties, roleId)

    Vue.set(partyToSet, 'polarity', rolePolarity)
  },

  deleteTicketOverviewParty: ({ ticketOverviewParties }, { payload }) => {
    const partyToUnset = findPartyById(ticketOverviewParties, payload)

    Vue.delete(ticketOverviewParties, partyToUnset)
  },

  deleteTicketOverviewPartyContact: ({ ticketOverviewParties }, { payload }) => {
    const { roleId, contactId, contactType } = payload
    const partyToSet = findPartyById(ticketOverviewParties, roleId)
    const contactTypeList = partyToSet.legacyDto[contactType + 's']
    const contactToDelete = findContactIndex(contactTypeList, contactId)

    Vue.delete(contactTypeList, contactToDelete)
  },

  updateTicketRoleBankAccount: (state, { payload }) => {
    const { bankAccountId, personId } = payload

    const indexPartie = state.ticketOverviewParties.findIndex(partie => {
      return partie.person.id === personId
    })

    if (indexPartie >= 0) {
      state.ticketOverviewParties[indexPartie].bankAccountsDto.forEach((item, index) => {
        if (item.id === bankAccountId && !item.associatedInDispute) {
          Vue.set(state.ticketOverviewParties[indexPartie].bankAccountsDto[index], 'associatedInDispute', true)
        } else {
          Vue.set(state.ticketOverviewParties[indexPartie].bankAccountsDto[index], 'associatedInDispute', false)
        }
      })
    }
  },

  setTicketOverviewProperties: (state, params) => Vue.set(state, 'ticketOverviewProperties', params),

  setTicketOverviewAttachments: (state, params) => Vue.set(state, 'ticketOverviewAttachments', params),

  setLastTicketOffers: (state, params) => Vue.set(state, 'lastTicketOffers', params),

  updateLastTicketOffers: (state, { payload }) => {
    const { polarityObjectKey, value } = payload
    Vue.set(state.lastTicketOffers[polarityObjectKey], 'value', value)
  },

  updateTicket: (state, dispute) => {
    Vue.set(state, 'ticketOverview', new TicketOverview(dispute))
    Vue.set(state, 'ticketOverviewInfo', new TicketOverviewInfo(dispute))
    Vue.set(state, 'ticketOverviewParties', dispute.disputeRoles.map(party => new TicketOverviewParties(party)))
    dispute.lastCounterOfferRoleId = state.lastTicketOffers?.plaintiffOffer?.roleId
    Vue.set(state, 'lastTicketOffers', new TicketOverviewLastOffers(dispute))
  },

  incrementTicketOverviewCountGetters: (state) => (state.ticketOverviewCountGetters += 1),

  decrementTicketOverviewCountGetters: (state) => {
    if (state.ticketOverviewCountGetters > 0) {
      state.ticketOverviewCountGetters -= 1
    }
  },

  toggleFavoriteTicket: (state, { payload: { disputeId, favorite } }) => {
    if (Number(state.ticketOverview.disputeId) === Number(disputeId)) {
      Vue.set(state.ticketOverview, 'favorite', favorite)
    }
  },

  pauseTicket(state, { _ }) {
    Vue.set(state.ticketOverview, 'paused', true)
  },

  resumeTicket(state, { _ }) {
    Vue.set(state.ticketOverview, 'paused', false)
  },

  setAttachmentConfidentiality: (state, { payload: { id } }) => {
    state.ticketOverviewAttachments.forEach((attach, attachIndex) => {
      if (attach.id === id) {
        Vue.set(state.ticketOverviewAttachments[attachIndex], 'confidential', !attach.confidential)
      }
    })
  }
}

export default overviewMutations
