import Vue from 'vue'

const alertMutations = {
  clearAlerts(state) {
    state.alerts = []
  },
  addAlert(state, alert) {
    if (!state.alerts.find(a => a.id === alert.id)) { state.alerts.push(alert) }
  },
  removeAlert(state, alertChanged) {
    Vue.nextTick(() => {
      const alertIndex = state.alerts.findIndex(a => alertChanged.id === a.id)
      Vue.delete(state.alerts, alertIndex)
    })
  }
}

export default alertMutations
