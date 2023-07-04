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

  getIntegrationConfigs({ getters: { useIntegrationBff } }) {
    return axiosDispatch({
      method: 'GET',
      url: `${integrationPath}/config`,
      params: { useIntegrationBff },
      mutation: 'setIntegrationConfigs'
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
