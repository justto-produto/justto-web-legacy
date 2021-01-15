import { axiosDispatch } from '@/utils/'

const overviewApi = '/disputes/v2'
const officeApi = '/office'

const overviewActions = {
  getDisputeOverview(disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}`,
      mutation: 'setDisputeOverview'
    })
  },

  getDisputeOverviewInfo(disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/info`,
      mutation: 'setDisputeOverviewInfo'
    })
  },

  getDisputeOverviewParties(disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/parties`,
      mutation: 'setDisputeOverviewParties'
    })
  },

  getDisputeOverviewProperties(disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/properties`,
      mutation: 'setDisputeOverviewProperties'
    })
  },

  getDisputeOverviewAttachments(disputeId) {
    return axiosDispatch({
      url: `${officeApi}/disputes/${disputeId}/attachments`,
      mutation: 'setDisputeOverviewAttachments'
    })
  }
}

export default overviewActions
