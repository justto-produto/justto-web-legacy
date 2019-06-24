import Vue from 'vue'

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
    let changedIndex = state.disputes.findIndex(dispute => {
      return (disputeChanged.id === dispute.id)
    })
    if (changedIndex === -1) {
      state.disputes.push(disputeChanged)
    } else {
      Vue.set(state.disputes, changedIndex, disputeChanged)
    }
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
