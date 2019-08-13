import Vue from 'vue'

const disputeMutations = {
  clearDisputes (state) {
    state.disputesDTO = []
  },
  clearDisputeFilters (state) {
    state.filters.terms = {}
  },
  setDisputes (state, disputesDTO) {
    state.disputesDTO = disputesDTO
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
      let changedIndex = state.disputesDTO.findIndex(dispute => {
        return (disputeChanged.id === dispute.id)
      })
      if (changedIndex === -1) {
        state.disputesDTO.push(disputeChanged)
      } else {
        Vue.set(state.disputesDTO, changedIndex, disputeChanged)
      }
    })
  },
  removeDisputeFromList (state, disputeId) {
    Vue.nextTick(() => {
      state.disputesDTO = state.disputesDTO.filter(dispute => {
        if (dispute.id === disputeId) {
          return false
        }
        return true
      })
    })
  },
  setDisputeStatuses (state, status) {
    state.statuses[status.label] = status.value
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
  },
  setDisputesPerPage (state, disputesPerPage) {
    state.filters.perPage = disputesPerPage
  }
}

export default disputeMutations
