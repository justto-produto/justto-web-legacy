const ticketsGetters = {
  getTickets: state => state.tickets,
  getTicketsQuery: state => state.ticketsQuery,
  getTicketsPrescriptions: state => state.ticketsQuery.prescriptions
}

export default ticketsGetters
