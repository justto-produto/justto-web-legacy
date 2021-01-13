import { axiosDispatch } from '@/utils/'

const ticketsApi = '/api/disputes/v2'

const overviewActions = {
  getTickets(tab) {
    return axiosDispatch({
      url: `${ticketsApi}/filter?status=RUNNING`,
      mutation: 'setCommunicationTickets'
      // mutation: tab ? 'setEngagementTickets' : 'setCommunicationsTickets'
    })
  }
}

export default overviewActions
