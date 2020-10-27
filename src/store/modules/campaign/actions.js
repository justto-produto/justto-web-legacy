import { axiosDispatch } from '@/utils'

const campaignsPath = 'api/campaigns'

const campaignActions = {
  getCampaigns({ _ }) {
    return axiosDispatch({
      url: 'api/disputes/campaigns',
      mutation: 'setCampaigns'
    })
  },
  getCampaignByName({ _ }, name) {
    return axiosDispatch({
      url: `${campaignsPath}/search?name=${name}`
    })
  },
  createCampaign({ _ }, campaign) {
    return axiosDispatch({
      url: `${campaignsPath}`,
      method: 'POST',
      data: campaign
    })
  }
}

export default campaignActions
