// import TicketCommunicationItem from '@/models/negotiations/tickets/TicketCommunicationItemVm'
// import TicketEngagementItem from '@/models/negotiations/tickets/TicketEngagementItemVm'
import Vue from 'vue'

const ticketsMutations = {
  setCommunicationTickets: (state, params) => (Vue.set(state, 'tickets', params)),
  setCommunicationTicketsNextPage: (state, params) => {
    params.content = state.tickets.content.concat(params.content)
    Vue.set(state, 'tickets', params)
  },
  setTicketsQuery: ({ ticketsQuery }, { key, value }) => (Vue.set(ticketsQuery, key, value)),
  addTicketQueryPage: ({ ticketsQuery }) => (ticketsQuery.page++)
}

export default ticketsMutations
