import Vue from 'vue'
// import TicketOverview from '@/models/negotiations/overview/TicketOverviewVm'
// import TicketOverviewInfo from '@/models/negotiations/overview/TicketOverviewInfoVm'
// import TicketOverviewParties from '@/models/negotiations/overview/TicketOverviewPartiesVm'
// import TicketOverviewProperties from '@/models/negotiations/overview/TicketOverviewPropertiesVm'
// import TicketOverviewAttachments from '@/models/negotiations/overview/TicketOverviewAttachmentsVm'

const overviewMutations = {
  setTicketOverview: (state, params) => (Vue.set(state, 'ticketOverview', params)),
  setTicketOverviewInfo: ({ ticketOverviewInfo }, params) => (ticketOverviewInfo = params),
  setTicketOverviewParties: ({ ticketOverviewParties }, params) => (ticketOverviewParties = params),
  setTicketOverviewProperties: ({ ticketOverviewParties }, params) => (ticketOverviewParties = params),
  setTicketOverviewAttachments: ({ ticketOverviewAttachments }, params) => (ticketOverviewAttachments = params)
}

export default overviewMutations
