import Vue from 'vue'
// import TicketOverview from '@/models/negotiations/overview/TicketOverviewVm'
// import TicketOverviewInfo from '@/models/negotiations/overview/TicketOverviewInfoVm'
// import TicketOverviewParties from '@/models/negotiations/overview/TicketOverviewPartiesVm'
// import TicketOverviewProperties from '@/models/negotiations/overview/TicketOverviewPropertiesVm'
// import TicketOverviewAttachments from '@/models/negotiations/overview/TicketOverviewAttachmentsVm'

const overviewMutations = {
  setTicketOverview: (state, params) => (Vue.set(state, 'ticketOverview', params)),
  setTicketOverviewInfo: (state, params) => (Vue.set(state, 'ticketOverviewInfo', params)),
  setTicketOverviewParties: (state, params) => (Vue.set(state, 'ticketOverviewParties', params)),
  setTicketOverviewParty: ({ ticketOverviewParties }, params) => {
    const { data, payload } = params
    const partyIndex = ticketOverviewParties.findIndex(party => party.disputeRoleId === payload)
    const partyToSet = ticketOverviewParties[partyIndex]

    Vue.set(partyToSet, 'emailsDto', data.emails)
    Vue.set(partyToSet, 'phonesDto', data.phones)
    Vue.set(partyToSet, 'oabsDto', data.oabs)
    Vue.set(partyToSet, 'legacyDto', data) // TODO: Remover essa merda aqui
  },
  setTicketOverviewProperties: (state, params) => (Vue.set(state, 'ticketOverviewProperties', params)),
  setTicketOverviewAttachments: (state, params) => (Vue.set(state, 'ticketOverviewAttachments', params)),
  setLastTicketOffers: (state, params) => (Vue.set(state, 'lastTicketOffers', params))
}

export default overviewMutations
