const moment = require('moment')

const disputeGetters = {
  filteredDisputes: state => {
    let filteredDisputes = state.disputes.slice(0)
    if (state.filters) {
      switch (state.filters.tab) {
        case '0':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return dispute.disputestatus === 'ENGAGEMENT' && !dispute.disputehasinteractions
          })
          break
        case '1':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return dispute.disputestatus === 'ENGAGEMENT' && dispute.disputehasinteractions
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
            return dispute[term] === state.filters.terms[term]
          })
        }
      }
    }
    return filteredDisputes
  },
  prescriptionOne: state => {
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
  prescriptionTwo: state => {
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
  prescriptionThree: state => {
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
  prescriptionFour: state => {
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
  prescriptionFive: state => {
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
  prescriptionSix: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if (dispute.disputestatus === 'ENGAGEMENT' &&
        dispute.communicationmsgtotalallsented) {
        return true
      }
    })
    return filteredDisputes
  },
  prescriptionSeven: state => {
    let filteredDisputes = state.disputes.filter(dispute => {
      if ((dispute.alerts && dispute.alerts.length > 0) ||
          (dispute.claiments && dispute.claiments.alerts && dispute.claiments.alerts.length > 0) ||
          (dispute.claimentslawyer && dispute.claimentslawyer.alerts && dispute.claimentslawyer.alerts.length > 0)) {
        return true
      }
    })
    return filteredDisputes
  }
}

export default disputeGetters
