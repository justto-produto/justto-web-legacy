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
  setDisputeSort (state, sort) {
    state.filters.sort.prop = sort.prop
    state.filters.sort.order = sort.order
  },
  setFilterPersonId (state, id) {
    state.filters.filterPersonId = id
  },
  updateDisputeList (state, disputeChanged) {
    // TODO: Retirar o timeout após a morte do elastic search
    setTimeout(function () {
      let changedIndex = state.disputes.findIndex(dispute => {
        return (disputeChanged.id === dispute.id)
      })
      if (changedIndex === -1) {
        state.disputes.push(disputeChanged)
      } else {
        Vue.set(state.disputes, changedIndex, disputeChanged)
      }
    }, 1000)
  },
  removeDisputeFromList (state, disputeId) {
    // TODO: Retirar o timeout após a morte do elastic search
    setTimeout(function () {
      state.disputes = state.disputes.filter(dispute => {
        if (dispute.disputeid === disputeId) {
          return false
        }
        return true
      })
    }, 1000)
  },
  setDisputeStatuses (state, status) {
    state.disputeStatuses[status.label] = status.value
  }
}

export default disputeMutations
