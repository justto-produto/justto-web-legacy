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
  clearDispute (state) {
    state.dispute = { id: 0 }
  },
  clearDisputeOccurrence (state) {
    state.occurrences.length = 0
  },
  clearDisputes (state) {
    state.disputes = []
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
    const size = state.query.size
    state.query = {
      status: [],
      campaigns: [],
      strategy: [],
      persons: [],
      dealDate: [],
      expirationDate: [],
      onlyFavorite: false,
      page: 1,
      size: size,
      term: '',
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
    if (occurrences && occurrences.length) state.occurrences = occurrences
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
  SOCKET_ADD_DISPUTE (state, disputeChanged) {
    Vue.nextTick(() => {
      let disputeIndex = state.disputes.findIndex(d => disputeChanged.id === d.id)
      if (disputeIndex !== -1) {
        let dispute = state.disputes.find(d => disputeChanged.id === d.id)
        if (dispute.updatedAt && disputeChanged.updatedAt && moment(dispute.updatedAt.dateTime).isSameOrBefore(moment(disputeChanged.updatedAt.dateTime))) {
          Vue.set(state.disputes, disputeIndex, disputeChanged)
        } else {
          Vue.set(state.disputes, disputeIndex, disputeChanged)
        }
      }
    })
  },
  setDisputeStatuses (state, status) {
    state.statuses[status.label] = status.value
  }
  // setDisputeTab (state, tab) {
  //   state.filters.tab = tab
  // },
  // clearDisputeTab (state, tab) {
  //   state.filters.tab = '0'
  // },
  // setDisputeFilterTerm (state, term) {
  //   state.filters.filterTerm = term
  // },
  // clearDisputeFilterTerm (state, tab) {
  //   state.filters.filterTerm = ''
  // },
  // changePriorityView (state) {
  //   state.filters.priorityOnly = !state.filters.priorityOnly
  // },
  // setDisputeSort (state, sort) {
  //   state.filters.sort.prop = sort.prop
  //   state.filters.sort.order = sort.order
  // },
  // clearDisputeSort (state) {
  //   state.filters.sort.prop = null
  //   state.filters.sort.order = null
  // },
  // setFilterPersonId (state, id) {
  //   state.filters.filterPersonId = id
  //   state.filters.filteredPerson = false
  // },
  // setDisputesPerPage (state, disputesPerPage) {
  //   state.filters.perPage = disputesPerPage
  // }
}

export default disputeMutations
