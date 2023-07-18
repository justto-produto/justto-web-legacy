import Vue from 'vue'

export default {
  setIntegrationConfigs(state, configs) {
    Vue.set(state, 'configs', configs)
  },

  setIntegrationWebhooks(state, { webhooks }) {
    Vue.set(state, 'webhooks', webhooks)
  },

  setIntegrationEstrategias(state, { estrategias }) {
    Vue.set(state, 'estrategias', estrategias)
  },

  setIntegrationPreNegociacao(state, { preNegociacao }) {
    Vue.set(state, 'preNegociacao', preNegociacao)
  },

  setUrlIntegracaoReceberEventos(state, url) {
    Vue.set(state, 'urlIntegracaoReceberEventos', url)
  }
}
