// import TicketOverview from '@/models/negotiations/overview/TicketOverviewVm'
// import TicketOverviewInfo from '@/models/negotiations/overview/TicketOverviewInfoVm'
// import TicketOverviewParties from '@/models/negotiations/overview/TicketOverviewPartiesVm'
// import TicketOverviewProperties from '@/models/negotiations/overview/TicketOverviewPropertiesVm'
// import TicketOverviewAttachments from '@/models/negotiations/overview/TicketOverviewAttachmentsVm'

const overviewState = {
  ticketOverview: {
    status: ''
  },
  ticketOverviewInfo: {},
  ticketOverviewParties: [],
  ticketOverviewProperties: {},
  ticketOverviewCountGetters: 0,
  ticketOverviewAttachments: [],
  lastTicketOffers: {},
  haveAssociatedContacts: false,
  ticketMetadata: {
    phones: [],
    emails: []
  }
}

export default overviewState
