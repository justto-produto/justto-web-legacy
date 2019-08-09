import Vue from 'vue'
import disputeViewModel from './model'

const disputeMutations = {
  clearDisputes (state) {
    state.disputes = []
  },
  clearDisputeFilters (state) {
    state.filters.terms = {}
  },
  setDisputes (state, disputes) {
    state.disputesDTO = disputes
    state.disputes = disputeViewModel(disputes)
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
  setDisputeSort (state, sort) {
    state.filters.sort.prop = sort.prop
    state.filters.sort.order = sort.order
  },
  setFilterPersonId (state, id) {
    state.filters.filterPersonId = id
  },
  updateDisputeList (state, disputeChanged) {
    Vue.nextTick(() => {
      let changedIndex = state.disputes.findIndex(dispute => {
        return (disputeChanged.id === dispute.id)
      })
      if (changedIndex === -1) {
        state.disputes.push(disputeChanged)
      } else {
        Vue.set(state.disputes, changedIndex, disputeChanged)
      }
    })
  },
  removeDisputeFromList (state, disputeId) {
    Vue.nextTick(() => {
      state.disputes = state.disputes.filter(dispute => {
        if (dispute.id === disputeId) {
          return false
        }
        return true
      })
    })
  },
  setDisputeStatuses (state, status) {
    state.disputeStatuses[status.label] = status.value
  },
  addUpdatingList (state, disputeId) {
    if (!(disputeId in state.updatingList)) {
      state.updatingList.push(disputeId)
    }
  },
  removeUpdatingList (state, disputeId) {
    state.updatingList = state.updatingList.filter(dispute => {
      if (dispute.id === disputeId) {
        return false
      }
      return true
    })
  }
}

export default disputeMutations
