const disputeMutations = {
  clearDisputeFilters (state) {
    state.filters = { tab: '0', terms: {} }
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
