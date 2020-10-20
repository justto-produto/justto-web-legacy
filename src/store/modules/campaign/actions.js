import axiosDispatcher from '@/store/axiosDispatcher'

const campaignsPath = 'api/campaigns'

const campaignActions = {
  getCampaigns({ commit }) {
    return axiosDispatcher({
      url: 'api/disputes/campaigns',
      mutation: 'setCampaigns'
    })
  },
  getCampaignByName({ _ }, name) {
    return axiosDispatcher({
      url: `${campaignsPath}/search?name=${name}`
    })
  },
  createCampaign({ commit }, campaign) {
    return axiosDispatcher({
      url: `${campaignsPath}`,
      method: 'POST',
      data: campaign
    })
  }
}

export default campaignActions
