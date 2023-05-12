import TicketOverviewPartySortItem from '@/models/negotiations/overview/TicketOverviewPartySortItem'

const overviewGetters = {
  getTicketOverview: ({ ticketOverview }) => ticketOverview,
  getTicketOverviewInfo: ({ ticketOverviewInfo }) => ticketOverviewInfo,
  getTicketOverviewParties: state => {
    return state.ticketOverviewParties.sort((a, b) => {
      const roleA = new TicketOverviewPartySortItem(a)
      const roleB = new TicketOverviewPartySortItem(b)

      return (roleA.polarityWeight + roleA.rolesWeight) - (roleB.polarityWeight + roleB.rolesWeight)
    })
  },
  getLastTicketOffers: ({ lastTicketOffers }) => lastTicketOffers,
  getTicketOverviewProperties: ({ ticketOverviewProperties }) => ticketOverviewProperties,
  getTicketOverviewAttachments: ({ ticketOverviewAttachments }) => ticketOverviewAttachments,
  isTicketOverviewloading: ({ ticketOverviewCountGetters }) => ticketOverviewCountGetters > 0,
  getTicketMetadata: ({ ticketMetadata }) => ticketMetadata,
  getTicketOverviewStatus: ({ ticketOverview }) => ticketOverview.status || '',
  AssociatedContactsPropertie: ({ haveAssociatedContacts }) => haveAssociatedContacts,
  showAssociatedContacts: ({
    haveAssociatedContacts,
    ticketOverview: {
      status
    }
  }) => (['IMPORTED', 'ENGAGEMENT', 'PENDING'].includes(status) && !!haveAssociatedContacts && ['NAO'].includes(haveAssociatedContacts)),
  getTicketOverviewNegotiators: ({ ticketOverviewParties = [] }) => ticketOverviewParties.filter(({ roles }) => roles.includes('NEGOTIATOR'))
}

export default overviewGetters
