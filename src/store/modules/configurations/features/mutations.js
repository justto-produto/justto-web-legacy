import Vue from 'vue'

export default {
  setIntegrationFields(state, value) {
    Vue.set(state, 'apiIntegrationFields', value)
  }
}
