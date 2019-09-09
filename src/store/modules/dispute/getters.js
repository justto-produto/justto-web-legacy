import moment from 'moment'
import i18n from '@/plugins/vueI18n.js'
import { fuseSearchDisputes } from '@/plugins/jusUtils'

const disputeGetters = {
  disputes: state => state.disputes,
  disputeFilters: state => state.filters,
  disputeHasFilters: state => {
    return Object.keys(state.filters.terms).length > 0 || !!state.filters.filterTerm || !!state.filters.filterPersonId
  },
  priorityOnly: state => state.filters.priorityOnly,
  disputeFiltersTerm: state => state.filters.filterTerm,
  filterPersonId: state => state.filters.filterPersonId,
  disputeInitialLoad: state => state.initialLoad,
  findDisputeById: (state) => (disputeId) => state.disputes.find(d => d.id === parseInt(disputeId)),
  filteredDisputes: (state, getters) => {
    let filteredDisputes = getters.disputes.slice(0)
    if (state.filters) {
      switch (state.filters.tab) {
        case '0':
          filteredDisputes = filteredDisputes.filter(d => d.tab === 'ENGAGEMENT')
          if (state.filters.priorityOnly) {
            filteredDisputes = filteredDisputes.filter(d => d.disputeNextToExpire)
          }
          break
        case '1':
          filteredDisputes = filteredDisputes.filter(d => d.tab === 'INTERACTION')
          if (state.filters.priorityOnly) {
            filteredDisputes = filteredDisputes.filter(d => !d.visualized)
          }
          break
        case '2':
          filteredDisputes = filteredDisputes.filter(d => d.tab === 'NEWDEALS')
          if (state.filters.priorityOnly) {
            filteredDisputes = filteredDisputes.filter(d => !d.visualized)
          }
          break
      }
      for (var term in state.filters.terms) {
        if (state.filters.terms.hasOwnProperty(term)) {
          filteredDisputes = filteredDisputes.filter(dispute => {
            if (Array.isArray(state.filters.terms[term])) {
              return moment(dispute[term].dateTime)
                .isBetween(
                  state.filters.terms[term][0],
                  state.filters.terms[term][1],
                  'day', '[]')
            } else if (term === 'status' && state.filters.terms[term] === 'PAUSED') {
              return !!dispute.paused
            } else if (term === 'status' && state.filters.terms[term] === 'INTERACTIONS') {
              return !!dispute.hasInteraction && (dispute.status === 'ENGAGEMENT' || dispute.status === 'RUNNING')
            } else {
              return dispute[term] === state.filters.terms[term]
            }
          })
        }
      }
      if (state.filters.filterPersonId > 0) {
        filteredDisputes = filteredDisputes.filter(dispute => {
          let filter = false
          if (dispute.negotiators && dispute.negotiators.length > 0) {
            for (let negotiator of dispute.negotiators) {
              if (negotiator.personId === state.filters.filterPersonId) {
                filter = true
              }
            }
          }
          return filter
        })
        state.filters.filteredPerson = true
      }
      if (state.filters.sort.order) {
        filteredDisputes.sort((a, b) => {
          let compareA = JSON.parse(JSON.stringify(a))
          let compareB = JSON.parse(JSON.stringify(b))
          let directionA = state.filters.sort.order === 'ascending' ? 1 : -1
          let directionB = directionA === 1 ? -1 : 1
          if (typeof compareA[state.filters.sort.prop] !== 'boolean' && moment(new Date(compareA[state.filters.sort.prop])).isValid()) {
            if (!compareA[state.filters.sort.prop]) compareA[state.filters.sort.prop] = moment(0)
            if (!compareB[state.filters.sort.prop]) compareB[state.filters.sort.prop] = moment(0)
            if (moment(compareA[state.filters.sort.prop]).isAfter(compareB[state.filters.sort.prop])) return directionA
            if (moment(compareA[state.filters.sort.prop]).isBefore(compareB[state.filters.sort.prop])) return directionB
            return 0
          } else if (state.filters.sort.prop === 'status') {
            if (i18n.t('occurrence.type.' + compareA.status).trim() > i18n.t('occurrence.type.' + compareB.status).trim()) return directionA
            if (i18n.t('occurrence.type.' + compareA.status).trim() < i18n.t('occurrence.type.' + compareB.status).trim()) return directionB
            return 0
          } else {
            if (compareA[state.filters.sort.prop] > compareB[state.filters.sort.prop]) return directionA
            if (compareA[state.filters.sort.prop] < compareB[state.filters.sort.prop]) return directionB
            return 0
          }
        })
      }
      if (state.filters.filterTerm) {
        filteredDisputes = fuseSearchDisputes(filteredDisputes, state.filters.filterTerm)
      }
    }
    return filteredDisputes
  },
  disputeStatuses: state => state.statuses,
  disputeActiveTab: state => state.filters.tab,
  disputesPerPage: state => state.filters.perPage
}

export default disputeGetters
