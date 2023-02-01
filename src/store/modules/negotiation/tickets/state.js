const ticketsState = {
  tickets: { content: [] },
  ticketsActiveTab: 'running',
  ticketsMap: {},
  ticketsHasFilters: false,
  ticketsPreventFilters: false,
  ticketsPreventSocket: false,
  ticketsQuery: {
    status: ['RUNNING'],
    sort: [
      'visualized,asc',
      'lastInboundInteraction.createdAt,desc',
      'expirationDate,asc'
    ],
    size: 20,
    page: 1,
    prescriptions: []
  },
  ticketsGettersCounter: 0,
  hideTickets: false
}

export default ticketsState
