// import TicketCommunicationItem from '@/models/negotiations/tickets/TicketCommunicationItemVm'
// import TicketEngagementItem from '@/models/negotiations/tickets/TicketEngagementItemVm'

const ticketsMutations = {
  setCommunicationTickets: (state, params) => (state.tickets = params),
  setEngagementTickets: ({ tickets }, params) => (tickets = params)
}

export default ticketsMutations
