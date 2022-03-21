import { axiosDispatch } from '@/utils'

const disputesApi = 'api/disputes'

export default {
  getOutcomeReasonsConfig({ _ }, type) {
    return axiosDispatch({
      url: `${disputesApi}/outcome-reasons/${type}`
    })
  }
}
