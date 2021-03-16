const ticketsState = {
  // ticketsPreNegotiation: {},
  // ticketsEngagement: {},
  // ticketsRunning: {},
  // ticketsAccepted: {},
  // ticketsFinished: {},

  // ticketsPreNegotiationQuery: {
  //   status: ['PRE_NEGOTIATION'],
  //   size: 20,
  //   page: 0
  // },
  // ticketsEngagementQuery: {
  //   status: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'],
  //   size: 20,
  //   page: 0
  // },
  // ticketsRunningQuery: {
  //   status: ['RUNNING'],
  //   size: 20,
  //   page: 0
  // },
  // ticketsAcceptedQuery: {
  //   status: ['ACCEPTED', 'CHECKOUT'],
  //   size: 20,
  //   page: 0
  // },
  // ticketsFinishedQuery: {
  //   prescription: ['NEWLY_FINISHED'],
  //   size: 20,
  //   page: 0
  // },

  tickets: { content: [] },
  ticketsActiveTab: 'running',
  ticketsMap: {},
  ticketsHasFilters: false,
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
  ticketsGettersCounter: 0
}

export default ticketsState
