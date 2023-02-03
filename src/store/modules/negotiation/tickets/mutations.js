import Vue from 'vue'
import TicketCommunicationItem from '@/models/negotiations/tickets/TicketCommunicationItemVm'
import TicketEngagementItem from '@/models/negotiations/tickets/TicketEngagementItemVm'

const getTicketIndex = (tickets, disputeId) => tickets.findIndex(ticket => ticket.disputeId === disputeId)

const EngagementTicketStatus = [
  'PRE_NEGOTIATION'
]

const ticketsMutations = {
  setCommunicationTickets: (state, { data, payload }) => {
    if (payload === 'nextPage') {
      data.content = state.tickets.content.concat(data.content)
    }
    Vue.set(state, 'tickets', {
      ...data,
      content: data.content.map(ticket => EngagementTicketStatus.includes(ticket.disputeStatus) ? new TicketEngagementItem(ticket) : ticket)
    })

    if ((state.ticketsQuery.prescriptions || []).includes('NEED_FOLLOW_UP')) {
      Vue.set(state.tickets, 'content', (state.tickets.content || []).sort((a, b) => {
        return a?.lastInteraction?.type === 'PHONE_CALL' && b?.lastInteraction?.type !== 'PHONE_CALL' ? 1 : 0
      }))
    }
  },

  deleteTicket: ({ tickets }, { payload }) => {
    const ticketIndex = getTicketIndex(tickets.content, payload)
    if (ticketIndex > -1) Vue.delete(tickets.content, ticketIndex)
  },

  removeCanceledTicket: ({ tickets }, { payload: { disputeId, remove } }) => {
    if (remove) {
      const ticketIndex = getTicketIndex(tickets.content, disputeId)
      if (ticketIndex > -1) Vue.delete(tickets.content, ticketIndex)
    }
  },

  cancelTicket: (state, { payload }) => {
    const { disputeId } = payload
    const content = [...state.tickets.content.filter((ticket) => Number(ticket.disputeId) !== Number(disputeId))]
    Vue.set(state.tickets, 'content', content)
  },

  setTicketsQuery: (state, { key, value }) => {
    Vue.set(state.ticketsQuery, key, value)
  },

  addTicketQueryPage: ({ ticketsQuery }) => (ticketsQuery.page += 1),

  setTicketPrescription: ({ ticketsQuery }, prescription) => {
    const index = ticketsQuery.prescriptions.length
    Vue.set(ticketsQuery.prescriptions, index, prescription)
  },

  unsetTicketPrescription: (state, prescription) => {
    const prescriptions = state?.ticketsQueryticketsQuery?.prescriptions || []

    Vue.set(state.ticketsQuery, 'prescriptions', prescriptions.filter(item => item !== prescription))
  },

  setTicketsFilters: (state, filters) => {
    const { ticketsQuery } = state

    Vue.set(state, 'ticketsQuery', filters)
    Vue.set(ticketsQuery, 'page', 1)
  },

  setTicketsHasFilters: (state, hasFilters) => Vue.set(state, 'ticketsHasFilters', hasFilters),

  setPreventFilters: (state, preventFilters) => Vue.set(state, 'ticketsPreventFilters', preventFilters),

  setPreventSocket: (state, preventSocket) => Vue.set(state, 'ticketsPreventSocket', preventSocket),

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

  resetTicketsGettersCounter: (state) => Vue.set(state, 'ticketsGettersCounter', 0),

  resetTicketsLastPage: state => {
    Vue.delete(state.tickets, 'last')
  },

  setHideTicket: (state, value) => {
    Vue.set(state, 'hideTickets', Boolean(value))
  }
}

export default ticketsMutations
