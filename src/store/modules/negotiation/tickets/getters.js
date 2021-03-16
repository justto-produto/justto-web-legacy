const ticketsGetters = {
  getTickets: ({ tickets }) => tickets,
  getTicketsQuery: ({ ticketsQuery }) => ticketsQuery,
  getTicketsHasFilters: ({ ticketsHasFilters }) => ticketsHasFilters,
  getTicketsActiveTab: ({ ticketsActiveTab }) => ticketsActiveTab,
  getTicketsPrescriptions: ({ ticketsQuery }) => ticketsQuery.prescriptions,
  getTicketsIsLoading: ({ ticketsGettersCounter: counter, ticketsQuery: query }) => counter > 0 && query.page <= 2
}

export default ticketsGetters
