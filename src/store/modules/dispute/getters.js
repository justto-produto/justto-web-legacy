import moment from 'moment'

const disputeGetters = {
  loadingDisputes: state => state.loading,
  disputes: state => state.disputes,
  occurrences: state => state.occurrences,
  disputeQuery: state => state.query,
  disputeQueryTerm: state => state.query.term,
  disputeTab: state => state.tab,
  dispute: state => state.dispute,
  disputeAttachments: state => state.disputeAttachments,
  loadingAttachments: state => state.loadingAttachments,
  disputeProperties: state => state.disputeProperties,
  disputeId: state => state.dispute.id || 0,
  disputeHasFilters: state => state.hasFilters,
  disputeStatuses: state => state.statuses,
  disputeHasNew: state => state.hasNew,
  getDisputesTimeline: state => state.timeline,
  disputeMetadata: state => state.metadata,
  exportHistory: state => state.exportHistory,
  respondents: state => state.respondents,
  filterSummary: _ => (disputePhase, summarys) => {
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
  disputeNotVisualizedFinished: (state, getters) => {
    return getters.filterSummary('FINISHED', state.summaryNotVisualizeds)
  },
  disputeNotVisualizedPreNegotiation: (state, getters) => {
    return getters.filterSummary('PRE_NEGOTIATION', state.summaryNotVisualizeds)
  },
  hasPrescription: state => (prescription) => state.query.prescriptions.includes(prescription),
  getRecentPrescriptions: ({ recentPrescriptions }) => {
    return Object.keys(recentPrescriptions).filter(p => moment(new Date()).diff(recentPrescriptions[p], 'days') < 1)
  },
  prescriptionsList: state => state.prescriptionsList.sort(),

  partyAnalysisByDocument: state => (documentNumber) => state.partyAnalysis[documentNumber],

  lastAccess: state => state.lastAccess,

  disputeLastInteractions: state => state.disputeLastInteractions,

  getCanUseBatchAction: state => (action) => {
    if (!state.batchActionsLastUse[action]) return true

    const actionLastTime = moment(state.batchActionsLastUse[action])
    const diferece = moment().diff(actionLastTime, 'seconds')

    switch (action) {
      case 'CHANGE_NEGOTIATOR':
        return diferece >= 120
      default:
        return diferece >= 30
    }
  },

  getDisputesNeedsRestart: state => state.disputesNeedsRestart
}

export default disputeGetters
