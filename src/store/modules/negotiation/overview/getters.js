const overviewGetters = {
  getTicketOverview: ({ ticketOverview }) => ticketOverview,
  getTicketOverviewInfo: ({ ticketOverviewInfo }) => ticketOverviewInfo,
  getTicketOverviewParties: ({ ticketOverviewParties }) => {
    return ticketOverviewParties.sort((a, b) => {
      let positionOfRoleA = ''
      if (a.roles.includes('LAWYER') && a.roles.includes('PARTY')) positionOfRoleA = 1
      else if (a.roles.includes('PARTY') && !a.roles.includes('LAWYER')) positionOfRoleA = 2
      else if (a.roles.includes('LAWYER') && !a.roles.includes('PARTY')) positionOfRoleA = 3
      else if (a.roles.includes('NEGOTIATOR')) positionOfRoleA = 4

      let positionOfRoleB = ''
      if (b.roles.includes('LAWYER') && b.roles.includes('PARTY')) positionOfRoleB = 1
      else if (b.roles.includes('PARTY') && !b.roles.includes('LAWYER')) positionOfRoleB = 2
      else if (b.roles.includes('LAWYER') && !b.roles.includes('PARTY')) positionOfRoleB = 3
      else if (b.roles.includes('NEGOTIATOR')) positionOfRoleB = 4

      if (a.polarity === b.polarity) {
        if (positionOfRoleA < positionOfRoleB) return -1
        else if (positionOfRoleA > positionOfRoleB) return 1
        else return 0
      } else {
        if (a.polarity === 'CLAIMANT' && b.polarity === 'RESPONDENT') return -1
        else if (a.polarity === 'RESPONDENT' && b.polarity === 'CLAIMANT') return 1
        else return 0
      }
    })
  },
  getLastTicketOffers: ({ lastTicketOffers }) => lastTicketOffers,
  getTicketOverviewProperties: ({ ticketOverviewProperties }) => ticketOverviewProperties,
  getTicketOverviewAttachments: ({ ticketOverviewAttachments }) => ticketOverviewAttachments,
  isTicketOverviewloading: ({ ticketOverviewCountGetters }) => ticketOverviewCountGetters > 0,
  getTicketMetadata: ({ ticketMetadata }) => ticketMetadata,
  AssociatedContactsPropertie: ({ haveAssociatedContacts }) => haveAssociatedContacts,
  showAssociatedContacts: ({ haveAssociatedContacts }) => (!!haveAssociatedContacts && ['NAO'].includes(haveAssociatedContacts)),
  getTicketOverviewNegotiators: ({ ticketOverviewParties }) => ticketOverviewParties.filter(({ roles }) => roles.includes('NEGOTIATOR'))
}

export default overviewGetters
