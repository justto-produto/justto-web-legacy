import Vue from 'vue'

export default {
  setIntegrationConfigs(state, configs) {
    Vue.set(state, 'configs', configs)
  }
}
