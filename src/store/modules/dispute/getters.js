import moment from 'moment'
import i18n from '@/plugins/vueI18n.js'
import { fuseSearchDisputes, getFirstRole } from '@/plugins/jusUtils'

const disputeGetters = {
  disputes: state => state.disputes,
  disputeFilters: state => state.filters,
  filterPersonId: state => state.filters.filterPersonId,
  filteredDisputes: state => {
    let filteredDisputes = state.disputes.slice(0)
    if (state.filters) {
      // switch (state.filters.tab) {
      //   case '0':
      //     filteredDisputes = filteredDisputes.filter(dispute => {
      //       return dispute.status === 'ENGAGEMENT' && !dispute.hasInteraction && !dispute.paused
      //     })
      //     break
      //   case '1':
      //     filteredDisputes = filteredDisputes.filter(dispute => {
      //       return (dispute.status === 'ENGAGEMENT' || dispute.status === 'RUNNING') && dispute.hasInteraction
      //     })
      //     break
      //   case '2':
      //     filteredDisputes = filteredDisputes.filter(dispute => {
      //       return dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT'
      //     })
      //     break
      // }
      // for (var term in state.filters.terms) {
      //   if (state.filters.terms.hasOwnProperty(term)) {
      //     filteredDisputes = filteredDisputes.filter(dispute => {
      //       if (term === 'disputeexpirationdate' || term === 'disputedealdate' || term === 'lastinteractiondate') {
      //         return moment(dispute[term]).isSame(state.filters.terms[term], 'day')
      //       } else if (term === 'disputestatus' && state.filters.terms[term] === 'PAUSED') {
      //         return !!dispute.paused
      //       } else if (term === 'disputestatus' && state.filters.terms[term] === 'INTERACTIONS') {
      //         return !!dispute.hasInteraction && (dispute.status === 'ENGAGEMENT' || dispute.status === 'RUNNING')
      //       } else {
      //         return dispute[term] === state.filters.terms[term]
      //       }
      //     })
      //   }
      // }
      // if (state.filters.filterPersonId > 0) {
      //   filteredDisputes = filteredDisputes.filter(dispute => {
      //     let filter = false
      //     if (dispute.negotiators && dispute.negotiators.length > 0) {
      //       for (let negotiator of dispute.negotiators) {
      //         if (negotiator.id === state.filters.filterPersonId) {
      //           filter = true
      //         }
      //       }
      //     }
      //     return filter
      //   })
      // }
      // if (state.filters.sort.order) {
      //   filteredDisputes.sort((a, b) => {
      //     let compareA = Object.assign({}, a)
      //     let compareB = Object.assign({}, b)
      //     let directionA = state.filters.sort.order === 'ascending' ? 1 : -1
      //     let directionB = directionA === 1 ? -1 : 1
      //     if (moment(new Date(compareA[state.filters.sort.prop])).isValid()) {
      //       if (!compareA[state.filters.sort.prop]) compareA[state.filters.sort.prop] = moment(0)
      //       if (!compareB[state.filters.sort.prop]) compareB[state.filters.sort.prop] = moment(0)
      //       if (moment(compareA[state.filters.sort.prop]).isAfter(compareB[state.filters.sort.prop])) return directionA
      //       if (moment(compareA[state.filters.sort.prop]).isBefore(compareB[state.filters.sort.prop])) return directionB
      //       return 0
      //     } else if (state.filters.sort.prop === 'campaign') {
      //       if (compareA[state.filters.sort.prop].name > compareB[state.filters.sort.prop].name) return directionA
      //       if (compareA[state.filters.sort.prop].name < compareB[state.filters.sort.prop].name) return directionB
      //     } else if (state.filters.sort.prop === 'claimants' || state.filters.sort.prop === 'claimantsLawyer') {
      //       let role = state.filters.sort.prop === 'claimants' ? 'PARTY' : 'LAWYER'
      //       if (
      //         getFirstRole(compareA.disputeRoles, 'CLAIMANT', role).replace(/ .*/, '') >
      //         getFirstRole(compareB.disputeRoles, 'CLAIMANT', role).replace(/ .*/, '')) return directionA
      //       if (
      //         getFirstRole(compareA.disputeRoles, 'CLAIMANT', role).replace(/ .*/, '') <
      //         getFirstRole(compareB.disputeRoles, 'CLAIMANT', role).replace(/ .*/, '')) return directionB
      //       return 0
      //     } else if (state.filters.sort.prop === 'status') {
      //       if (i18n.t('occurrence.type.' + compareA[state.filters.sort.prop]) > i18n.t('occurrence.type.' + compareB[state.filters.sort.prop])) return directionA
      //       if (i18n.t('occurrence.type.' + compareA[state.filters.sort.prop]) < i18n.t('occurrence.type.' + compareB[state.filters.sort.prop])) return directionB
      //       return 0
      //     } else if (state.filters.sort.prop === 'lastOfferValue') {
      //       if (compareA.objects[0].offers.slice(-1).pop().value > compareB.objects[0].offers.slice(-1).pop().value) return directionA
      //       if (compareA.objects[0].offers.slice(-1).pop().value < compareB.objects[0].offers.slice(-1).pop().value) return directionB
      //       return 0
      //     } else if (state.filters.sort.prop === 'disputeDealDate') {
      //       if (compareA.conclusion) {
      //         if (compareB.conclusion) {
      //           if (compareA.conclusion.conclusionDate.dateTimeToDate > compareB.conclusion.conclusionDate.dateTimeToDate) return directionA
      //           if (compareA.conclusion.conclusionDate.dateTimeToDate < compareB.conclusion.conclusionDate.dateTimeToDate) return directionB
      //           return 0
      //         } else {
      //           return directionB
      //         }
      //       } else {
      //         return directionA
      //       }
      //     } else if (state.filters.sort.prop === 'disputeUpperRange') {
      //       if (parseInt(compareA.objects[0].respondentBoundary.boundary.replace('.','').replace(',','')) > parseInt(compareB.objects[0].respondentBoundary.boundary.replace('.','').replace(',',''))) return directionA
      //       if (parseInt(compareA.objects[0].respondentBoundary.boundary.replace('.','').replace(',','')) < parseInt(compareB.objects[0].respondentBoundary.boundary.replace('.','').replace(',',''))) return directionB
      //       return 0
      //     } else {
      //       if (compareA[state.filters.sort.prop] > compareB[state.filters.sort.prop]) return directionA
      //       if (compareA[state.filters.sort.prop] < compareB[state.filters.sort.prop]) return directionB
      //       return 0
      //     }
      //   })
      // }
      // if (state.filters.filterTerm) {
      //   filteredDisputes = fuseSearchDisputes(filteredDisputes).search(state.filters.filterTerm)
      // }
    }
    return filteredDisputes
  },
  alertOne: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.status === 'IMPORTED' ||
        dispute.status === 'PENDING' ||
        dispute.status === 'ENRICHED' ||
        dispute.status === 'ENGAGEMENT' ||
        dispute.status === 'RUNNING') &&
        moment(dispute.expirationDate.dateTime).isBetween(moment(), moment().add(3, 'day'))
      ) {
        return true
      }
    })
    return filteredDisputes
  },
  alertTwo: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.status === 'IMPORTED' ||
        dispute.status === 'PENDING' ||
        dispute.status === 'ENRICHED' ||
        dispute.status === 'ENGAGEMENT' ||
        dispute.status === 'RUNNING') &&
        !dispute.hasvalidemail) {
        return true
      }
    })
    return filteredDisputes
  },
  alertThree: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.status === 'IMPORTED' ||
        dispute.status === 'PENDING' ||
        dispute.status === 'ENRICHED' ||
        dispute.status === 'ENGAGEMENT' ||
        dispute.status === 'RUNNING') &&
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
        (dispute.status === 'IMPORTED' ||
        dispute.status === 'PENDING' ||
        dispute.status === 'ENRICHED' ||
        dispute.status === 'ENGAGEMENT' ||
        dispute.status === 'RUNNING') &&
        dispute.hasInteraction &&
        !dispute.lastcounteroffervalue
      ) {
        return true
      }
    })
    return filteredDisputes
  },
  alertFive: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.status === 'IMPORTED' ||
        dispute.status === 'PENDING' ||
        dispute.status === 'ENRICHED' ||
        dispute.status === 'ENGAGEMENT' ||
        dispute.status === 'RUNNING') &&
        !dispute.hasvalidphone) {
        return true
      }
    })
    return filteredDisputes
  },
  alertSix: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if (dispute.status === 'ENGAGEMENT' &&
        dispute.communicationmsgtotalallsented) {
        return true
      }
    })
    return filteredDisputes
  },
  alertSeven: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if (
        dispute.status !== 'SETTLED' &&
        dispute.status !== 'UNSETTLED' &&
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
  disputeActiveTab: state => state.filters.tab,
  disputesUpdatingList: state => state.updatingList
}

export default disputeGetters
