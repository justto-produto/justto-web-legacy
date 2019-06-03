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
  }
}

export default disputeMutations
