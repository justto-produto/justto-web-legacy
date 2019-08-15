import Vue from 'vue'
import moment from 'moment'

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
      let disputeIndex = state.disputesDTO.findIndex(d => disputeChanged.id === d.id)
      if (disputeIndex === -1) {
        state.disputesDTO.push(disputeChanged)
      } else {
        let dispute = state.disputesDTO.find(d => disputeChanged.id === d.id)
        if (moment(dispute.updateAt.dateTime).isBefore(moment(disputeChanged.updateAt.dateTime))) {
          Vue.set(state.disputesDTO, disputeIndex, disputeChanged)
        }
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
  setDisputesPerPage (state, disputesPerPage) {
    state.filters.perPage = disputesPerPage
  }
}

export default disputeMutations
