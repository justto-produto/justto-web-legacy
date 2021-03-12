const ticketsGetters = {
  getTickets: ({ tickets }) => tickets,
  getTicketsQuery: ({ ticketsQuery }) => ticketsQuery,
  getTicketsHasFilters: ({ ticketsHasFilters }) => ticketsHasFilters,
  getTicketsActiveTab: ({ ticketsActiveTab }) => ticketsActiveTab,
  getTicketsPrescriptions: ({ ticketsQuery }) => ticketsQuery.prescriptions
}

export default ticketsGetters
