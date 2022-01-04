import { axiosDispatch } from '@/utils'

export default {
  getGupShupTemplates({ _ }) {
    return axiosDispatch({
      url: 'api/messages/management-gupshup/templates',
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
