import Vue from 'vue'
import moment from 'moment'

const disputeMutations = {
  clearDisputes (state) {
    state.disputes = []
  },
  clearDisputeFilters (state) {
    state.filters.terms = {}
  },
  setDisputeTab (state, tab) {
    state.filters.tab = tab
  },
  clearDisputeTab (state, tab) {
    state.filters.tab = '0'
  },
  setDisputeFilter (state, terms) {
    state.filters.terms = terms
  },
  setDisputeFilterTerm (state, term) {
    state.filters.filterTerm = term
  },
  clearDisputeFilterTerm (state, tab) {
    state.filters.filterTerm = ''
  },
  setInitialLoad (state) {
    state.initialLoad = true
  },
  clearInitialLoad (state) {
    state.initialLoad = false
  },
  setDisputeSort (state, sort) {
    state.filters.sort.prop = sort.prop
    state.filters.sort.order = sort.order
    state.filters.sort.processed = false
  },
  setFilterPersonId (state, id) {
    state.filters.filterPersonId = id
    state.filters.filteredPerson = false
  },
  updateDisputeList (state, disputeChanged) {
    Vue.nextTick(() => {
      let disputeIndex = state.disputes.findIndex(d => disputeChanged.id === d.id)
      if (disputeIndex === -1) {
        state.disputes.push(disputeChanged)
      } else {
        let dispute = state.disputes.find(d => disputeChanged.id === d.id)
        if (dispute.updateAt && (!dispute.updateAt.dateTime || moment(dispute.updateAt.dateTime).isSameOrBefore(moment(disputeChanged.updateAt.dateTime)))) {
          Vue.set(state.disputes, disputeIndex, disputeChanged)
        }
      }
    })
  },
  removeDisputeFromList (state, disputeChanged) {
    Vue.nextTick(() => {
      let disputeIndex = state.disputes.findIndex(d => disputeChanged.id === d.id)
      Vue.delete(state.disputes, disputeIndex)
    })
  },
  setDisputeStatuses (state, status) {
    state.statuses[status.label] = status.value
  },
  setDisputesPerPage (state, disputesPerPage) {
    state.filters.perPage = disputesPerPage
  }
}

export default disputeMutations
