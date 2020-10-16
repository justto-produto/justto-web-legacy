const actions = {
  getCampaigns({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/campaigns')
        .then(response => {
          commit('setCampaigns', response.data)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getCampaignByName({ commit }, name) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/campaigns/search?name=' + name)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  createCampaign({ commit }, campaign) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/campaigns', campaign)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default actions
