const ticketsGetters = {
  getTickets: ({ tickets }) => tickets,
  getTicketsQuery: ({ ticketsQuery }) => ticketsQuery,
  getTicketsActiveTab: ({ ticketsActiveTab }) => ticketsActiveTab,
  getTicketsPrescriptions: ({ ticketsQuery }) => ticketsQuery.prescriptions
}

export default ticketsGetters
