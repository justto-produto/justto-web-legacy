const getters = {
  campaignList: state => state.list.sort((a, b) => {
    if (a < b) return 1
    if (a > b) return -1
    return 0
  })
  // activeCampaigns: (state, getters) => {
  //   let filteredCampaigns = []
  //   for (let dispute of getters.disputes) {
  //     let activeCampaign = state.list.filter((campaign) => {
  //       return campaign.name === dispute.campaignName
  //     })
  //     if (activeCampaign && activeCampaign.length) filteredCampaigns.push(activeCampaign[0])
  //   }
  //   filteredCampaigns = filteredCampaigns.sort((a, b) => {
  //     if (a.createdAt < b.createdAt) { return 1 }
  //     if (a.createdAt > b.createdAt) { return -1 }
  //     return 0
  //   })
  //   return new Set(filteredCampaigns)
  // }
}

export default getters
