import moment from 'moment'
import i18n from '@/plugins/vueI18n.js'
import Fuse from 'fuse.js'

const disputeGetters = {
  disputes: state => state.disputes,
  disputeFilters: state => state.filters,
  filterPersonId: state => state.filters.filterPersonId,
  filteredDisputes: state => {
    let filteredDisputes = state.disputes.slice(0)
    if (state.filters) {
      switch (state.filters.tab) {
        case '0':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return dispute.disputestatus === 'ENGAGEMENT' && !dispute.disputehasinteractions && !dispute.paused
          })
          break
        case '1':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return (dispute.disputestatus === 'ENGAGEMENT' || dispute.disputestatus === 'RUNNING') && dispute.disputehasinteractions
          })
          break
        case '2':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return dispute.disputestatus === 'ACCEPTED' || dispute.disputestatus === 'CHECKOUT'
          })
          break
      }
      for (var term in state.filters.terms) {
        if (state.filters.terms.hasOwnProperty(term)) {
          filteredDisputes = filteredDisputes.filter(dispute => {
            if (term === 'disputeexpirationdate' || term === 'disputedealdate' || term === 'lastinteractiondate') {
              return moment(dispute[term]).isSame(state.filters.terms[term], 'day')
            } else if (term === 'disputestatus' && state.filters.terms[term] === 'PAUSED') {
              return !!dispute.paused
            } else if (term === 'disputestatus' && state.filters.terms[term] === 'INTERACTIONS') {
              return !!dispute.disputehasinteractions && (dispute.disputestatus === 'ENGAGEMENT' || dispute.disputestatus === 'RUNNING')
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
              if (negotiator.id === state.filters.filterPersonId) {
                filter = true
              }
            }
          }
          return filter
        })
      }
      if (state.filters.sort.order) {
        filteredDisputes.sort((a, b) => {
          let compareA = Object.assign({}, a)
          let compareB = Object.assign({}, b)
          let directionA = state.filters.sort.order === 'ascending' ? 1 : -1
          let directionB = directionA === 1 ? -1 : 1
          if (moment(compareA[state.filters.sort.prop]).isValid()) {
            if (!compareA[state.filters.sort.prop]) compareA[state.filters.sort.prop] = moment(0)
            if (!compareB[state.filters.sort.prop]) compareB[state.filters.sort.prop] = moment(0)
            if (moment(compareA[state.filters.sort.prop]).isAfter(compareB[state.filters.sort.prop])) return directionA
            if (moment(compareA[state.filters.sort.prop]).isBefore(compareB[state.filters.sort.prop])) return directionB
            return 0
          } else if (state.filters.sort.prop === 'claiments' || state.filters.sort.prop === 'claimentslawyer') {
            if (Array.isArray(compareA[state.filters.sort.prop])) {
              if (Array.isArray(compareB[state.filters.sort.prop])) {
                if (compareA[state.filters.sort.prop][0]['name'] > compareB[state.filters.sort.prop][0]['name']) return directionA
                if (compareA[state.filters.sort.prop][0]['name'] < compareB[state.filters.sort.prop][0]['name']) return directionB
                return 0
              } else {
                return directionA
              }
            } else {
              if (Array.isArray(compareB[state.filters.sort.prop])) {
                return directionB
              } else {
                return 0
              }
            }
          } else if (state.filters.sort.prop === 'disputestatus') {
            if (i18n.t('occurrence.type.' + compareA[state.filters.sort.prop]) > i18n.t('occurrence.type.' + compareB[state.filters.sort.prop])) return directionA
            if (i18n.t('occurrence.type.' + compareA[state.filters.sort.prop]) < i18n.t('occurrence.type.' + compareB[state.filters.sort.prop])) return directionB
            return 0
          } else {
            if (compareA[state.filters.sort.prop] > compareB[state.filters.sort.prop]) return directionA
            if (compareA[state.filters.sort.prop] < compareB[state.filters.sort.prop]) return directionB
            return 0
          }
        })
      }
      if (state.filters.filterTerm) {
        var run = new Fuse(filteredDisputes, {
          shouldSort: true,
          tokenize: true,
          matchAllTokens: true,
          threshold: 0.1,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            'disputeid',
            'disputecode',
            'campaignname',
            'claiments.name',
            'claiments.document_number',
            'claimentslawyer.name',
            'claimentslawyer.document_number',
            'strategyname',
            'disputeupperrange',
            'disputelastrespondentoffer',
            'lastOfferValue'
          ]
        })
        filteredDisputes = run.search(state.filters.filterTerm)
      }
    }
    return filteredDisputes
  },
  alertOne: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.disputestatus === 'IMPORTED' ||
        dispute.disputestatus === 'PENDING' ||
        dispute.disputestatus === 'ENRICHED' ||
        dispute.disputestatus === 'ENGAGEMENT' ||
        dispute.disputestatus === 'RUNNING') &&
        moment(dispute.disputeexpirationdate).isBetween(moment(), moment().add(3, 'day'))
      ) {
        return true
      }
    })
    return filteredDisputes
  },
  alertTwo: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.disputestatus === 'IMPORTED' ||
        dispute.disputestatus === 'PENDING' ||
        dispute.disputestatus === 'ENRICHED' ||
        dispute.disputestatus === 'ENGAGEMENT' ||
        dispute.disputestatus === 'RUNNING') &&
        !dispute.hasvalidemail) {
        return true
      }
    })
    return filteredDisputes
  },
  alertThree: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.disputestatus === 'IMPORTED' ||
        dispute.disputestatus === 'PENDING' ||
        dispute.disputestatus === 'ENRICHED' ||
        dispute.disputestatus === 'ENGAGEMENT' ||
        dispute.disputestatus === 'RUNNING') &&
        (dispute.lastofferpercenttoupperrange >= 100 &&
        dispute.lastofferpercenttoupperrange <= 120)) {
        return true
      }
    })
    return filteredDisputes
  },
  alertFour: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if (
        (dispute.disputestatus === 'IMPORTED' ||
        dispute.disputestatus === 'PENDING' ||
        dispute.disputestatus === 'ENRICHED' ||
        dispute.disputestatus === 'ENGAGEMENT' ||
        dispute.disputestatus === 'RUNNING') &&
        dispute.disputehasinteractions &&
        !dispute.lastcounteroffervalue
      ) {
        return true
      }
    })
    return filteredDisputes
  },
  alertFive: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.disputestatus === 'IMPORTED' ||
        dispute.disputestatus === 'PENDING' ||
        dispute.disputestatus === 'ENRICHED' ||
        dispute.disputestatus === 'ENGAGEMENT' ||
        dispute.disputestatus === 'RUNNING') &&
        !dispute.hasvalidphone) {
        return true
      }
    })
    return filteredDisputes
  },
  alertSix: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if (dispute.disputestatus === 'ENGAGEMENT' &&
        dispute.communicationmsgtotalallsented) {
        return true
      }
    })
    return filteredDisputes
  },
  alertSeven: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if (
        dispute.disputestatus !== 'SETTLED' &&
        dispute.disputestatus !== 'UNSETTLED' &&
        ((dispute.alerts && dispute.alerts.length > 0) ||
        (dispute.claiments && dispute.claiments.alerts && dispute.claiments.alerts.length > 0) ||
        (dispute.claimentslawyer && dispute.claimentslawyer.alerts && dispute.claimentslawyer.alerts.length > 0))
      ) {
        return true
      }
    })
    return filteredDisputes
  },
  disputeStatuses: state => state.disputeStatuses,
  disputeActiveTab: state => state.filters.tab
}

export default disputeGetters
