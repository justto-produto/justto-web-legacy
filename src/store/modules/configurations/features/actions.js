import { axiosDispatch } from '@/utils'

const disputesApi = 'api/disputes'
const disputesV2Api = 'api/disputes/v2'

export default {
  getOutcomeReasonsConfig({ _ }, type) {
    return axiosDispatch({
      url: `${disputesApi}/outcome-reasons/${type}`
    })
  },

  getAllOutcomeReasons({ _ }, type) {
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
  }
}
