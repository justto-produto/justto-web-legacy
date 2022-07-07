import { axiosDispatch } from '@/utils'

const disputesApi = 'api/disputes'
const disputesV2Api = 'api/disputes/v2'
const sendgridWhitelabelDomainsApi = 'api/email/domain'

export default {
  getOutcomeReasonsConfig({ _ }, type) {
    return axiosDispatch({
      url: `${disputesApi}/outcome-reasons/${type}`,
      mutation: 'setOutcomeReasons'
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

  getAutenticatedDomains({ _ }) {
    return axiosDispatch({
      url: `${sendgridWhitelabelDomainsApi}/authentication`
    })
  },

  getSendgridDomains({ _ }) {
    return axiosDispatch({
      url: `${sendgridWhitelabelDomainsApi}/sendgrid/whitelabel/domains`
    })
  },

  sendDnsEmail({ _ }, data) {
    return axiosDispatch({
      url: `${sendgridWhitelabelDomainsApi}/authentication/dns-email`,
      data,
      method: 'POST'
    })
  },

  setSendgridDomains({ _ }, data) {
    return axiosDispatch({
      method: 'POST',
      data,
      url: `${sendgridWhitelabelDomainsApi}/authentication`
    })
  }
}
