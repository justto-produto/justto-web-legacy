import Vue from 'vue'

const alertMutations = {
  clearAlerts (state) {
    state.alerts = []
  },
  addAlert (state, alert) {
    state.alerts.push(alert)
  },
  removeAlert (state, alertChanged) {
    Vue.nextTick(() => {
      let alertIndex = state.alerts.findIndex(a => alertChanged.id === a.id)
      Vue.delete(state.alerts, alertIndex)
    })
  }
}

export default alertMutations
