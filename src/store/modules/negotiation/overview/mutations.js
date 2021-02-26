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
  setTicketOverview: (state, params) => (Vue.set(state, 'ticketOverview', params)),
  updateTicketOverview: ({ ticketOverview }, { payload }) => {
    for (const key of Object.keys(payload)) Vue.set(ticketOverview, key, payload[key])
  },
  setTicketOverviewInfo: (state, params) => (Vue.set(state, 'ticketOverviewInfo', params)),
  updatedTicketOverviewInfo: ({ ticketOverviewInfo }, { payload }) => {
    for (const key of Object.keys(payload)) Vue.set(ticketOverviewInfo, key, payload[key])
  },
  setTicketOverviewParties: (state, params) => (Vue.set(state, 'ticketOverviewParties', params)),
  setTicketOverviewParty: ({ ticketOverviewParties }, params) => {
    const { data, payload } = params
    const partyToSet = findPartyById(ticketOverviewParties, payload)

    Vue.set(partyToSet, 'emailsDto', data.emails)
    Vue.set(partyToSet, 'phonesDto', data.phones)
    Vue.set(partyToSet, 'oabsDto', data.oabs)
    Vue.set(partyToSet, 'legacyDto', data) // TODO: Remover essa merda aqui
  },
  updateTicketOverviewParty: ({ ticketOverviewParties }, params) => {
    const { id, name, documentNumber } = params
    const partyToSet = findPartyById(ticketOverviewParties, id)

    Vue.set(partyToSet, 'legacyDto', params)
    Vue.set(partyToSet, 'name', name)
    Vue.set(partyToSet, 'documentNumber', documentNumber)
  },
  setTicketOverviewPartyContact: ({ ticketOverviewParties }, { payload }) => {
    const { roleId, contactType, contactData } = payload
    const partyToSet = findPartyById(ticketOverviewParties, roleId)
    const contactTypeList = partyToSet.legacyDto[contactType + 's']
    let contactToSet

    if (contactType === 'phone') contactToSet = { number: contactData.value } 
    else if (contactType === 'email') contactToSet = { address: contactData.value }
    else contactToSet = contactData

    contactTypeList.push(contactToSet)
    // const partyToSet = findPartyById(ticketOverviewParties, params.id)
    // Vue.set(partyToSet, 'legacyDto', params)
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
  setLastTicketOffers: (state, params) => (Vue.set(state, 'lastTicketOffers', params))
}

export default overviewMutations
