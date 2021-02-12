import { axiosDispatch } from '@/utils/'

const disputeApi = '/api/disputes/v2'
const officeApi = '/api/office'

const overviewActions = {
  getTicketOverview({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}`,
      mutation: 'setTicketOverview'
    })
  },

  getTicketOverviewInfo({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/info`,
      mutation: 'setTicketOverviewInfo'
    })
  },

  getTicketOverviewParties({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/parties`,
      mutation: 'setTicketOverviewParties'
    })
  },

  getTicketOverviewProperties({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/properties`,
      mutation: 'setTicketOverviewProperties'
    })
  },

  getTicketOverviewAttachments({ _ }, disputeId) {
    return axiosDispatch({
      url: `${officeApi}/disputes/${disputeId}/attachments`,
      mutation: 'setTicketOverviewAttachments'
    })
  },

  getLastTicketOffers({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/last-dispute-offer`,
      mutation: 'setLastTicketOffers'
    })
  },

  setTicketOverview({ _ }, params) {
    const { data, disputeId } = params

    return axiosDispatch({
      url: `${disputeApi}/${disputeId}`,
      method: 'PATCH',
      data
    })
  }
}

export default overviewActions
