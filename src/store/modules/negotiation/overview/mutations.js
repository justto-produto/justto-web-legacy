import Vue from 'vue'
// import TicketOverview from '@/models/negotiations/overview/TicketOverviewVm'
// import TicketOverviewInfo from '@/models/negotiations/overview/TicketOverviewInfoVm'
// import TicketOverviewParties from '@/models/negotiations/overview/TicketOverviewPartiesVm'
// import TicketOverviewProperties from '@/models/negotiations/overview/TicketOverviewPropertiesVm'
// import TicketOverviewAttachments from '@/models/negotiations/overview/TicketOverviewAttachmentsVm'

const findPartyById = (parties, roleId) => {
  const partyIndex = parties.findIndex(party => party.disputeRoleId === roleId)
  return parties[partyIndex]
}

const findContactIndex = (contactTypeList, contactId) => {
  return contactTypeList.findIndex(constact => constact.id === contactId)
}

const overviewMutations = {
  setTicketOverview: (state, params) => Vue.set(state, 'ticketOverview', params),

  updateTicketOverview: ({ ticketOverview }, { payload }) => {
    for (const key of Object.keys(payload)) Vue.set(ticketOverview, key, payload[key])
  },

  setTicketOverviewInfo: (state, params) => Vue.set(state, 'ticketOverviewInfo', params),

  updateTicketOverviewInfo: ({ ticketOverviewInfo }, { payload }) => {
    for (const key of Object.keys(payload)) Vue.set(ticketOverviewInfo, key, payload[key])
  },
  setTicketOverviewParties: (state, params) => (Vue.set(state, 'ticketOverviewParties', params)),

  setTicketOverviewParty: ({ ticketOverviewParties }, { data, payload }) => {
    const partyToSet = findPartyById(ticketOverviewParties, payload)

    Vue.set(partyToSet, 'emailsDto', data.emails)
    Vue.set(partyToSet, 'phonesDto', data.phones)
    Vue.set(partyToSet, 'oabsDto', data.oabs)
    Vue.set(partyToSet, 'birthday', data.personProperties?.BIRTHDAY)
    Vue.set(partyToSet, 'legacyDto', data) // TODO: Remover essa merda aqui
  },

  updateTicketOverviewParty: ({ ticketOverviewParties }, params) => {
    const { id, name, documentNumber, birthday } = params
    const partyToSet = findPartyById(ticketOverviewParties, id)

    Vue.set(partyToSet, 'name', name)
    Vue.set(partyToSet, 'birthday', birthday)
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

  setTicketOverviewProperties: (state, params) => (Vue.set(state, 'ticketOverviewProperties', params)),

  setTicketOverviewAttachments: (state, params) => (Vue.set(state, 'ticketOverviewAttachments', params)),

  setLastTicketOffers: (state, params) => (Vue.set(state, 'lastTicketOffers', params)),

  updateTicket: (state, dispute) => {
    // const { id } = dispute
    // Vue.set(state, 'ticketOverview', new TicketOverview())
    // Vue.set(state, 'ticketOverviewInfo', new TicketOverviewInfo())
    // Vue.set(state, 'ticketOverviewParties', new TicketOverviewParties())
    // Vue.set(state, 'ticketOverviewProperties', new TicketOverviewProperties())
    // Vue.set(state, 'ticketOverviewAttachments', new TicketOverviewAttachments())
    // Vue.set(state, 'lastTicketOffers', '')
  },

  incrementTicketOverviewCountGetters: (state) => (state.ticketOverviewCountGetters += 1),

  decrementTicketOverviewCountGetters: (state) => {
    if (state.ticketOverviewCountGetters > 0) {
      state.ticketOverviewCountGetters -= 1
    }
  }
}

export default overviewMutations
