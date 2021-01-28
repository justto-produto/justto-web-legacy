import { axiosDispatch } from '@/utils/'

const overviewApi = '/api/disputes/v2'
const officeApi = '/api/office'

const overviewActions = {
  getTicketOverview({ _ }, disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}`,
      mutation: 'setTicketOverview'
    })
  },

  getTicketOverviewInfo({ _ }, disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/info`,
      mutation: 'setTicketOverviewInfo'
    })
  },

  getTicketOverviewParties({ _ }, disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/parties`,
      mutation: 'setTicketOverviewParties'
    })
  },

  getTicketOverviewProperties({ _ }, disputeId) {
    return axiosDispatch({
      url: `${overviewApi}/${disputeId}/properties`,
      mutation: 'setTicketOverviewProperties'
    })
  },

  getTicketOverviewAttachments({ _ }, disputeId) {
    return axiosDispatch({
      url: `${officeApi}/disputes/${disputeId}/attachments`,
      mutation: 'setTicketOverviewAttachments'
    })
  }
}

export default overviewActions
