import Vue from 'vue'
import moment from 'moment'

const disputeMutations = {
  setDisputes (state, pageable) {
    state.disputes = pageable.content
    state.query.size = pageable.size
    state.query.total = pageable.totalElements
  },
  clearDisputes (state) {
    state.disputes = []
  },
  setDisputesSize (state, size) {
    state.query.size = size
  },
  setDisputesPage (state, page) {
    state.query.page = page
  },
  setDisputesFilters (state, filters) {
    Object.assign(state.filters, filters)
  },
  removeDisputesFilter (state, filter) {
    delete state.filters[filter]
  },
  clearDisputeFilters (state) {
    state.filters = { status: ['ENGAGEMENT'] }
  },
  setDisputesTab (state, tab) {
    state.tab = tab
  },
  clearDisputeTab (state, tab) {
    state.tab = '0'
  },


  SOCKET_ADD_OCCURRENCE (state, newOccurrence) {
    Vue.nextTick(() => {
      if (!newOccurrence.id) {
        state.occurrence.list.push(newOccurrence)
      } else {
        let occurrenceIndex = state.occurrence.list.findIndex(d => newOccurrence.id === d.id)
        if (occurrenceIndex === -1) {
          state.occurrence.list.push(newOccurrence)
        } else {
          Vue.set(state.occurrence.list, occurrenceIndex, newOccurrence)
        }
      }
    })
  },
  SOCKET_ADD_DISPUTE ({ commit, rootState }, dispute) {
    const negotiators = getRoles(dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR')
    const negotiatorIds = negotiators.map(n => n.personId)
    if (rootState.workspaceModule.profile === 'ADMINISTRATOR' ||
      negotiatorIds.includes(rootState.personModule.loggedPerson.id)) {
        disputeChanged.disputeNextToExpire = moment(disputeChanged.expirationDate.dateTime).isBetween(moment(), moment().add(3, 'day'))
        Vue.nextTick(() => {
          let disputeIndex = state.disputes.findIndex(d => disputeChanged.id === d.id)
          if (disputeIndex === -1) {
            state.disputes.push(disputeChanged)
          } else {
            let dispute = state.disputes.find(d => disputeChanged.id === d.id)
            if (dispute.updatedAt && disputeChanged.updatedAt) {
              if (moment(dispute.updatedAt.dateTime).isSameOrBefore(moment(disputeChanged.updatedAt.dateTime))) {
                Vue.set(state.disputes, disputeIndex, disputeChanged)
              }
            } else {
              Vue.set(state.disputes, disputeIndex, disputeChanged)
            }
          }
        })
    }
  },
  SOCKET_REMOVE_DISPUTE ({ commit }, dispute) {
    Vue.nextTick(() => {
      let disputeIndex = state.disputes.findIndex(d => disputeChanged.id === d.id)
      Vue.delete(state.disputes, disputeIndex)
    })
  },

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
  // setDisputeStatuses (state, status) {
  //   state.statuses[status.label] = status.value
  // },
  // setDisputesPerPage (state, disputesPerPage) {
  //   state.filters.perPage = disputesPerPage
  // }
}

export default disputeMutations
