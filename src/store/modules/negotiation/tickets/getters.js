const ticketsGetters = {
  getTickets: (state) => state.tickets,
  getTicketsQuery: state => state.ticketsQuery,
  getTicketsHasFilters: state => state.ticketsHasFilters,
  getTicketsPreventFilters: state => state.ticketsPreventFilters,
  getTicketsPreventSocket: state => state.ticketsPreventSocket,
  getTicketsActiveTab: state => state.ticketsActiveTab,
  getTicketsPrescriptions: state => state.ticketsQuery.prescriptions,
  getTicketsIsLoading: ({ ticketsGettersCounter: counter, ticketsQuery: query }) => counter > 0 && query.page <= 2
}

export default ticketsGetters
