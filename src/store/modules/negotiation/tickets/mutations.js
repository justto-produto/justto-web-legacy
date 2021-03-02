// import TicketCommunicationItem from '@/models/negotiations/tickets/TicketCommunicationItemVm'
// import TicketEngagementItem from '@/models/negotiations/tickets/TicketEngagementItemVm'
import Vue from 'vue'

const ticketsMutations = {
  setCommunicationTickets: (state, params) => {
    params.content = state.tickets.content.concat(params.content)
    Vue.set(state, 'tickets', params)
  },

  deleteTicket: ({ tickets }, { payload }) => {
    const ticketIndex = tickets.findIndex(ticket => ticket.disputeId === payload)
    Vue.delete(tickets, ticketIndex)
  },

  setTicketsQuery: ({ ticketsQuery }, { key, value }) => (Vue.set(ticketsQuery, key, value)),

  addTicketQueryPage: ({ ticketsQuery }) => (ticketsQuery.page++),

  addTicketPrescription: ({ ticketsQuery }, prescription) => {
    const index = ticketsQuery.prescriptions.length
    Vue.set(ticketsQuery.prescriptions, index, prescription)
  },

  removeTicketPrescription: ({ ticketsQuery }, prescription) => {
    const index = ticketsQuery.prescriptions.indexOf(prescription)
    Vue.delete(ticketsQuery.prescriptions, index)
  }

}

export default ticketsMutations
