
const alertGetters = {
  findDisputeAlertById: (state) => (entityId) => {
    return state.alerts.filter(d => d.source === 'DISPUTE' && d.childId === parseInt(entityId))
  },
  findDisputeOrgAlertById: (state) => (entityId) => {
    return state.alerts.filter(d => d.source === 'DISPUTE_ORG' && d.childId === parseInt(entityId))
  },
  findPersonAlertById: (state) => (entityId) => {
    return state.alerts.filter(d => d.source === 'PERSON' && d.childId === parseInt(entityId))
  },
  findOABAlertById: (state) => (entityId) => {
    return state.alerts.filter(d => d.source === 'OAB' && d.childId === parseInt(entityId))
  },
  findEmailAlertById: (state) => (entityId) => {
    return state.alerts.filter(d => d.source === 'EMAIL' && d.childId === parseInt(entityId))
  },
  findPhoneAlertById: (state) => (entityId) => {
    return state.alerts.filter(d => d.source === 'PHONE' && d.childId === parseInt(entityId))
  }
}

export default alertGetters
