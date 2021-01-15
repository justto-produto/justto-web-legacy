// import TicketOverview from '@/models/negotiations/overview/TicketOverviewVm'
// import TicketOverviewInfo from '@/models/negotiations/overview/TicketOverviewInfoVm'
// import TicketOverviewParties from '@/models/negotiations/overview/TicketOverviewPartiesVm'
// import TicketOverviewProperties from '@/models/negotiations/overview/TicketOverviewPropertiesVm'
// import TicketOverviewAttachments from '@/models/negotiations/overview/TicketOverviewAttachmentsVm'

const overviewMutations = {
  setDisputeOverview: ({ disputeOverview }, params) => (disputeOverview = params),
  setDisputeOverviewInfo: ({ disputeOverviewInfo }, params) => (disputeOverviewInfo = params),
  setDisputeOverviewParties: ({ disputeOverviewParties }, params) => (disputeOverviewParties = params),
  setDisputeOverviewProperties: ({ disputeOverviewParties }, params) => (disputeOverviewParties = params),
  setDisputeOverviewAttachments: ({ disputeOverviewAttachments }, params) => (disputeOverviewAttachments = params)
}

export default overviewMutations
