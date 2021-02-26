const ticketsGetters = {
  getTickets: state => state.tickets,
  getTicketsPrescriptions: state => state.ticketsQuery.prescriptions
}

export default ticketsGetters
