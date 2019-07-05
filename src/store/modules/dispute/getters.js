const moment = require('moment')

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
        moment(dispute.disputeexpirationdate).isBetween(moment().subtract(3, 'day'), moment())) {
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
      if ((dispute.disputestatus === 'IMPORTED' ||
        dispute.disputestatus === 'PENDING' ||
        dispute.disputestatus === 'ENRICHED' ||
        dispute.disputestatus === 'ENGAGEMENT' ||
        dispute.disputestatus === 'RUNNING') &&
        dispute.disputehasinteractions) {
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
  disputeStatuses: state => state.disputeStatuses
}

export default disputeGetters
