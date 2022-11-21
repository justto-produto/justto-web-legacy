import { axiosDispatch } from '@/utils'

export default {
  getGupShupTemplates({ _ }, name = 'justto') {
    return axiosDispatch({
      url: 'api/messages/management-gupshup/templates',
      params: { name },
      mutation: 'setTemplates'
    })
  },

  getGupShupWalletStatus({ _ }) {
    return axiosDispatch({
      url: 'api/messages/management-gupshup/wallet-status',
      mutation: 'setWalletStatus'
    })
  }
}
