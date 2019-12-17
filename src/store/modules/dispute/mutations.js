import Vue from 'vue'

const disputeMutations = {
  setDisputes (state, pageable) {
    state.disputes = pageable.content
    state.query.size = pageable.size
    state.query.total = pageable.totalElements
  },
  setDispute (state, disputeVM) {
    state.dispute = disputeVM
  },
  setDisputeBankAccounts (state, bankAccounts) {
    state.bankAccounts = bankAccounts
  },
  setDisputeRoles (state, disputeRoles) {
    state.dispute.disputeRoles = disputeRoles
  },
  clearDispute (state) {
    state.dispute = { id: 0 }
  },
  clearDisputeOccurrences (state) {
    state.occurrences.length = 0
  },
  clearDisputes (state) {
    state.disputes = []
    state.hasNew = false
  },
  incrementOccurrencesSize (state) {
    state.occurrencesSize = state.occurrencesSize + state.occurrencesInitialSize
  },
  clearOccurrencesSize (state) {
    state.occurrencesSize = state.occurrencesInitialSize
  },
  setDisputeQuery (state, query) {
    state.query = query
  },
  updateDisputeQuery (state, params) {
    state.query[params.key] = params.value
  },
  setSummaryNearExpirations (state, summarys) {
    state.summaryNearExpirations = summarys
  },
  setSummaryNotVisualizeds (state, summarys) {
    state.summaryNotVisualizeds = summarys
  },
  clearDisputeQuery (state) {
    state.query = {
      status: ['ENGAGEMENT'],
      sort: 'expirationDate,asc',
      campaigns: [],
      strategy: [],
      persons: [],
      expirationDate: [],
      dealDate: [],
      onlyFavorite: false,
      page: 1,
      size: 20,
      term: '',
      initialSize: 20,
      total: 0
    }
  },
  clearDisputeQueryByTab (state) {
    const size = state.query.size
    state.query = {
      status: [],
      campaigns: [],
      strategy: [],
      persons: state.query.persons,
      dealDate: [],
      expirationDate: [],
      onlyFavorite: false,
      page: 1,
      size: size,
      term: state.query.term,
      initialSize: 20,
      total: 0
    }
  },
  setDisputeHasFilters (state, bol) {
    state.hasFilters = bol
  },
  setDisputesTab (state, tab) {
    state.tab = tab
  },
  clearDisputeTab (state, tab) {
    state.tab = '0'
  },
  setDisputeOccurrences (state, occurrences) {
    if (occurrences && occurrences.length) state.occurrences = occurrences.reverse()
  },
  SOCKET_ADD_OCCURRENCE (state, newOccurrence) {
    Vue.nextTick(() => {
      if (!newOccurrence.id) {
        state.occurrences.push(newOccurrence)
      } else {
        let occurrenceIndex = state.occurrences.findIndex(d => newOccurrence.id === d.id)
        if (occurrenceIndex === -1) {
          state.occurrences.push(newOccurrence)
        } else {
          Vue.set(state.occurrences, occurrenceIndex, newOccurrence)
        }
      }
    })
  },
  SOCKET_ADD_DISPUTE_SUMARY (state, disputeWebsocketSummaryDto) {
    Vue.nextTick(() => {
      if (disputeWebsocketSummaryDto.type) {
        switch (disputeWebsocketSummaryDto.type) {
          case 'DISPUTE_NEAR_EXPIRATION' : state.summaryNearExpirations = disputeWebsocketSummaryDto.summaries
            break
          case 'DISPUTE_NOT_VISUALIZED' : state.summaryNotVisualizeds = disputeWebsocketSummaryDto.summaries
            break
        }
      }
    })
  },
  setDisputeStatuses (state, status) {
    state.statuses[status.label] = status.value
  },
  disputeSetHasNew (state, bol) {
    state.hasNew = bol
  },
  setRespondents (state, respondents) {
    state.respondents = respondents
  }
}

export default disputeMutations
