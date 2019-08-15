import Vue from 'vue'

const alertMutations = {
  clearAlerts (state) {
    state.alerts = []
  },
  addAlert (state, alert) {
    state.alerts.push(alert)
  }
}

export default alertMutations
