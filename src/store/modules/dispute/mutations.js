const disputeMutations = {
  clearDisputes (state) {
    state.disputes = []
  },
  clearDisputeFilters (state) {
    state.filters.terms = {}
  },
  setDisputes (state, disputes) {
    state.disputes = disputes
  },
  setDisputeTab (state, tab) {
    state.filters.tab = tab
  },
  setDisputeFilter (state, terms) {
    state.filters.terms = terms
  },
  setFilterPersonId (state, id) {
    state.filters.filterPersonId = id
  },
  updateDisputeList (state, disputeChanged) {
    state.disputes = state.disputes.map(dispute => {
      if (disputeChanged.id === dispute.id) {
        dispute = disputeChanged
      }
      return dispute
    })
  },
  removeDisputeFromList (state, disputeId) {
    state.disputes = state.disputes.filter(dispute => {
      if (dispute.disputeid === disputeId) {
        return false
      }
      return true
    })
  },
  setDisputeStatuses (state, status) {
    state.disputeStatuses[status.label] = status.value
  }
}

export default disputeMutations
