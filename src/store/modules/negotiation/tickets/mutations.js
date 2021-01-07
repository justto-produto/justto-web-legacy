const classesPath = '@/modules/negotiations/tickets'
import TicketCommunicationItem from `${classesPath}/TicketCommunicationItem`
import TicketEngagementItem from `${classesPath}/TicketEngagementItem`

const ticketsMutations = {
  setCommunicationTickets: ({ tickets }, params) => (tickets = new TicketCommunicationItem(params)),
  setEngagementTickets: ({ tickets }, params) => (tickets = new TicketEngagementItem(params))
}

export default ticketsMutations