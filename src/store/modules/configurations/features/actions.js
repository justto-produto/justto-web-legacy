import { axiosDispatch } from '@/utils'

const disputesApi = 'api/disputes'
const disputesV2Api = 'api/disputes/v2'
const sendgridWhitelabelDomainsApi = 'api/email/domain/authentication'

export default {
  getOutcomeReasonsConfig({ _ }, type) {
    return axiosDispatch({
      url: `${disputesApi}/outcome-reasons/${type}`
    })
  },

  getDefaultOutcomeReasons({ _ }, type) {
    return axiosDispatch({
      url: `${disputesV2Api}/outcome-reasons/default/${type}`
    })
  },

  setOutcomeReasons({ _ }, { type, reasons }) {
    return axiosDispatch({
      method: 'PATCH',
      url: `${disputesV2Api}/outcome-reasons/${type}`,
      data: reasons
    })
  },

  getSendgridDomains({ _ }) {
    return axiosDispatch({
      url: `${sendgridWhitelabelDomainsApi}`
    })
  }
}
