import Vue from 'vue'
import TicketCommunicationItem from '@/models/negotiations/tickets/TicketCommunicationItemVm'
import TicketEngagementItem from '@/models/negotiations/tickets/TicketEngagementItemVm'

const getTicketIndex = (tickets, disputeId) => tickets.findIndex(ticket => ticket.disputeId === disputeId)

const ticketsMutations = {
  setCommunicationTickets: (state, { data, payload }) => {
    if (payload === 'nextPage') data.content = state.tickets.content.concat(data.content)
    Vue.set(state, 'tickets', data)
  },

  deleteTicket: ({ tickets }, { payload }) => {
    const ticketIndex = getTicketIndex(tickets.content, payload)
    if (ticketIndex > -1) Vue.delete(tickets.content, ticketIndex)
  },

  setTicketsQuery: ({ ticketsQuery }, { key, value }) => Vue.set(ticketsQuery, key, value),

  addTicketQueryPage: ({ ticketsQuery }) => (ticketsQuery.page += 1),

  setTicketPrescription: ({ ticketsQuery }, prescription) => {
    const index = ticketsQuery.prescriptions.length
    Vue.set(ticketsQuery.prescriptions, index, prescription)
  },

  unsetTicketPrescription: ({ ticketsQuery }, prescription) => {
    const index = ticketsQuery.prescriptions.indexOf(prescription)
    Vue.delete(ticketsQuery.prescriptions, index)
  },

  setTicketsFilters: (state, filters) => {
    const { ticketsQuery } = state
    Vue.set(state, 'ticketsQuery', filters)
    Vue.set(ticketsQuery, 'page', 1)
  },

  setTicketsHasFilters: (state, hasFilters) => Vue.set(state, 'ticketsHasFilters', hasFilters),

  setTicketsActiveTab: (state, activeTab) => Vue.set(state, 'ticketsActiveTab', activeTab),

  updateTicketItemFromDisputeRole: ({ tickets }, disputeRole) => {
    const ticketIndex = getTicketIndex(tickets.content, disputeRole.disputeId)
    if (ticketIndex >= 0) {
      const ticket = tickets.content[ticketIndex]
      if (ticket && ticket.plaintiff && ticket.plaintiff.documentNumber === disputeRole.documentNumber) {
        Vue.set(ticket.plaintiff, 'name', disputeRole.name)
      }
    }
  },
  updateTicketItem: ({ tickets }, dispute) => {
    const ticketIndex = getTicketIndex(tickets.content, dispute.id)
    const newTicket = [
      'PRE_NEGOTIATION',
      'IMPORTED',
      'ENRICHED',
      'ENGAGEMENT',
      'PENDING'
    ].includes(dispute.status)
      ? new TicketEngagementItem(dispute)
      : new TicketCommunicationItem(dispute)

    if (tickets.empty !== undefined) {
      if (ticketIndex > -1) Vue.set(tickets.content, ticketIndex, newTicket)
      else tickets.content.unshift(newTicket)
    }
  },

  setTicketVisualized: ({ tickets }, { payload }) => {
    const { content } = tickets
    const { disputeId, visualized, anonymous } = payload

    if (!anonymous) {
      const ticketIndex = getTicketIndex(content, disputeId)
      if (ticketIndex > -1) Vue.set(content[ticketIndex], 'visualized', visualized)
    }
  },

  incrementTicketsGettersCounter: (state) => (state.ticketsGettersCounter += 1),

  decrementTicketsGettersCounter: (state) => {
    if (state.ticketsGettersCounter > 0) state.ticketsGettersCounter -= 1
  },

  resetTicketsGettersCounter: (state) => Vue.set(state, 'ticketsGettersCounter', 0)
}

export default ticketsMutations
