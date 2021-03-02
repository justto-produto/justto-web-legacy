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

  tickets: {
    content: []
  },
  ticketsMap: {},
  ticketsQuery: {
    status: ['RUNNING'],
    size: 20,
    page: 0,
    prescriptions: []
  }
}

export default ticketsState
