import { axiosDispatch } from '@/utils/'

const ticketsPath = '/disputes/v2'

const overviewActions = {
  getEngagementTickets() {
    return axiosDispatch({
      url: `${ticketsPath}/engagement`,
      mutation: 'setEngagementTickets'
    })
  },

  getCommunicationTickets() {
    return axiosDispatch({
      url: `${ticketsPath}/communication`,
      mutation: 'setCommunicationTickes'
    })
  }
}

export default overviewActions