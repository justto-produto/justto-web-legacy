
const alertGetters = {
  findDisputeAlertById: (state) => (entityId) => {
    let disputeAlerts = state.alerts.filter(d => d.childId === parseInt(entityId) && d.source === 'DISPUTE')
    return disputeAlerts
  },
  findDisputeOrgAlertById: (state) => (entityId) => {
    let disputeAlerts = state.alerts.filter(d => d.childId === parseInt(entityId) && d.source === 'DISPUTE_ORG')
    return disputeAlerts
  },
  findPersonAlertById: (state) => (entityId) => {
    let disputeAlerts = state.alerts.filter(d => d.childId === parseInt(entityId) && d.source === 'PERSON')
    return disputeAlerts
  },
  findOABAlertById: (state) => (entityId) => {
    let disputeAlerts = state.alerts.filter(d => d.childId === parseInt(entityId) && d.source === 'OAB')
    return disputeAlerts
  },
  findEmailAlertById: (state) => (entityId) => {
    let disputeAlerts = state.alerts.filter(d => d.childId === parseInt(entityId) && d.source === 'EMAIL')
    return disputeAlerts
  }
}

export default alertGetters
