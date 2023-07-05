import Vue from 'vue'

export default {
  setIntegrationConfigs(state, configs) {
    Vue.set(state, 'configs', configs)
  },

  setIntegrationWebhooks(state, { webhooks }) {
    Vue.set(state, 'webhooks', webhooks)
  }
}
