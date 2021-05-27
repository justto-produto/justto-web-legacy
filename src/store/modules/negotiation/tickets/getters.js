const ticketsGetters = {
  getTickets: (state) => state.tickets,
  getTicketsQuery: ({ ticketsQuery }) => ticketsQuery,
  getTicketsHasFilters: ({ ticketsHasFilters }) => ticketsHasFilters,
  getTicketsActiveTab: ({ ticketsActiveTab }) => (localStorage.getItem('TICKET_ACTIVE_TAB') || ticketsActiveTab),
  getTicketsPrescriptions: ({ ticketsQuery }) => ticketsQuery.prescriptions,
  getTicketsIsLoading: ({ ticketsGettersCounter: counter, ticketsQuery: query }) => counter > 0 && query.page <= 2
}

export default ticketsGetters
