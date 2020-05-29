const disputeGetters = {
  loadingDisputes: state => state.loading,
  disputes: state => state.disputes,
  occurrences: state => state.occurrences,
  disputeQuery: state => state.query,
  disputeQueryTerm: state => state.query.term,
  disputeTab: state => state.tab,
  dispute: state => state.dispute,
  disputeAttachments: state => state.disputeAttachments,
  disputeProprieties: state => state.disputeProprieties,
  disputeId: state => state.dispute.id || 0,
  disputeHasFilters: state => state.hasFilters,
  disputeStatuses: state => state.statuses,
  disputeHasNew: state => state.hasNew,
  respondents: state => state.respondents,
  filterSummary: state => (disputePhase, summarys) => {
    const filteredSummarys = summarys.filter(s => s.disputePhase === disputePhase)
    if (filteredSummarys && filteredSummarys.length > 0) {
      let counter = 0
      filteredSummarys.forEach(s => (counter += s.quantity))
      return counter
    } return 0
  },
  disputeNearExpirationsEngajement: (state, getters) => {
    return getters.filterSummary('ENGAGEMENT', state.summaryNearExpirations)
  },
  disputeNotVisualizedInteration: (state, getters) => {
    return getters.filterSummary('INTERACTION', state.summaryNotVisualizeds)
  },
  disputeNotVisualizedNewDeal: (state, getters) => {
    return getters.filterSummary('NEW_DEAL', state.summaryNotVisualizeds)
  },
  hasPrescription: state => (prescription) => state.query.prescriptions.includes(prescription),
  partyAnalysisByDocument: state => (documentNumber) => state.partyAnalysis[documentNumber],
}

export default disputeGetters
