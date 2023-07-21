export default {
  getIntegrationConfigs: state => state.configs,
  getIntegrationConfigsList: state => Object.entries(state.configs).map(([key, value]) => ({ key, value })),
  getIntegrationWebhooks: state => state.webhooks,
  getIntegrationEstrategias: state => state.estrategias || [],
  getIntegrationPreNegociacao: state => state.preNegociacao,
  getUrlIntegracaoReceberEventos: state => state.urlIntegracaoReceberEventos
}
