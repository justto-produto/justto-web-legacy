const ticketsGetters = {
  getTickets: (state) => state.tickets,
  getTicketsQuery: state => state.ticketsQuery,
  getTicketsHasFilters: state => state.ticketsHasFilters,
  getTicketsPreventFilters: state => state.ticketsPreventFilters,
  getTicketsPreventSocket: state => state.ticketsPreventSocket,
  getTicketsActiveTab: state => state.ticketsActiveTab,
  getTicketsPrescriptions: state => state.ticketsQuery.prescriptions,
  getTicketsIsLoading: state => state.ticketsGettersCounter > 0 && state.ticketsQuery.page <= 2,
  isToHideTickets: (state, getters) => getters.showNegotiationTypeMenu ? state.hideTickets : false
}

export default ticketsGetters
