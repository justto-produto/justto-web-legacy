import { axiosDispatch } from '@/utils'

const integrationPath = 'http://localhost:3001/api/gestao-integracao-bff/v1/integration'

export default {
  detectIntegration({ getters: { useIntegrationBff } }, url) {
    return axiosDispatch({
      method: 'POST',
      url: `${integrationPath}/detect`,
      params: { useIntegrationBff },
      data: { url }
    })
  },

  saveIntegrationConfigs({ getters: { useIntegrationBff } }, data) {
    return axiosDispatch({
      method: 'POST',
      url: `${integrationPath}/config`,
      params: { useIntegrationBff },
      data
    })
  },

  salvarIntegracaoPreNegociacao({ getters: { useIntegrationBff } }, data) {
    return axiosDispatch({
      method: 'POST',
      url: `${integrationPath}/preNegociacao`,
      params: { useIntegrationBff },
      data
    })
  },

  saveIntegrationWebhooks({ getters: { useIntegrationBff } }, webhooks) {
    return axiosDispatch({
      method: 'POST',
      url: `${integrationPath}/webhooks`,
      params: { useIntegrationBff },
      data: { webhooks },
      mutation: 'setIntegrationWebhooks'
    })
  },

  saveIntegrationEstrategias({ getters: { useIntegrationBff } }, estrategias) {
    return axiosDispatch({
      method: 'POST',
      url: `${integrationPath}/estrategias`,
      params: { useIntegrationBff },
      data: { estrategias },
      mutation: 'setIntegrationEstrategias'
    })
  },

  getIntegrationConfigs({ getters: { useIntegrationBff } }) {
    return axiosDispatch({
      method: 'GET',
      url: `${integrationPath}/config`,
      params: { useIntegrationBff },
      mutation: 'setIntegrationConfigs'
    })
  },

  getIntegrationWebhooks({ getters: { useIntegrationBff } }) {
    return axiosDispatch({
      method: 'GET',
      url: `${integrationPath}/webhooks`,
      params: { useIntegrationBff },
      mutation: 'setIntegrationWebhooks'
    })
  },

  getIntegrationEstrategias({ getters: { useIntegrationBff } }) {
    return axiosDispatch({
      method: 'GET',
      url: `${integrationPath}/estrategias`,
      params: { useIntegrationBff },
      mutation: 'setIntegrationEstrategias'
    })
  },

  buscarIntegracaoPreNegociacao({ getters: { useIntegrationBff } }) {
    return axiosDispatch({
      method: 'GET',
      url: `${integrationPath}/preNegociacao`,
      params: { useIntegrationBff },
      mutation: 'setIntegrationPreNegociacao'
    })
  },

  resetIntegrationConfigs({ getters: { useIntegrationBff } }) {
    return axiosDispatch({
      method: 'POST',
      url: `${integrationPath}/reset`,
      params: { useIntegrationBff }
    })
  }
}
