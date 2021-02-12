const overviewGetters = {
  getTicketOverview: ({ ticketOverview }) => ticketOverview,
  getTicketOverviewInfo: ({ ticketOverviewInfo }) => ticketOverviewInfo,
  getTicketOverviewParties: ({ ticketOverviewParties }) => ticketOverviewParties,
  getTicketOverviewProperties: ({ ticketOverviewProperties }) => ticketOverviewProperties,
  getTicketOverviewAttachments: ({ ticketOverviewAttachments }) => ticketOverviewAttachments,
  getLastTicketOffers: ({ lastTicketOffers }) => {
    const {
      defendentName,
      defendentValue,
      defendentRoleId,
      plaintffName,
      plaintffValue,
      plaintffRoleId
    } = lastTicketOffers

    return {
      defendantProposal: {
        name: defendentName,
        value: defendentValue || 0,
        roleId: defendentRoleId
      },
      plaintiffProposal: {
        name: plaintffName,
        value: plaintffValue || 0,
        roleId: plaintffRoleId
      }
    }
  }
}

export default overviewGetters
