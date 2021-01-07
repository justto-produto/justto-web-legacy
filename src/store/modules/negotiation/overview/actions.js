import { axiosDispatch } from '@/utils/'

const overviewApi = '/disputes/v2'
const officeApi = '/office'

const overviewActions = {
  getDisputeOverview() {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}`,
      mutation: 'setDisputeOverview'
    })
  },

  getDisputeOverviewInfo() {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/info`,
      mutation: 'setDisputeOverviewInfo'
    })
  },

  getDisputeOverviewParties() {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/parties`,
      mutation: 'setDisputeOverviewParties'
    })
  },

  getDisputeOverviewProperties() {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/properties`,
      mutation: 'setDisputeOverviewProperties'
    })
  },

  getDisputeOverviewAttachments() {
    return axiosDispatch({
      url: `${officeApi}/disputes/${disputeId}/attachments`,
      mutation: 'setDisputeOverviewAttachments'
    })
  }
}

export default overviewActions