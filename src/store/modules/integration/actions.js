import { axiosDispatch } from '@/utils'

const BFFPath = 'http://localhost:3001/api/gestao-integracao-bff/v1/detect-integration'

export default {
  detectIntegration({ getters: { useIntegrationBff } }, url) {
    return axiosDispatch({
      method: 'POST',
      url: BFFPath,
      params: { useIntegrationBff },
      data: { url }
    })
  }
}
