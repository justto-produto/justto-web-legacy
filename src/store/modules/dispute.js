const dispute = {
  state: {
  },
  mutations: {
  },
  actions: {
    getDispute ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('disputes/' + id)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDisputes ({ commit }, query) {
      return new Promise((resolve, reject) => {
        if (query) query = '?q=' + query
        // eslint-disable-next-line
        axios.get('http://homol.justto.com.br:9200/disputes/_search' + query)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDisputeSummary ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://c04e5875-40fe-4541-89a9-ce86905b94ec.mock.pstmn.io/disputes/' + id + '/summary')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDisputeSubscribe ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://c04e5875-40fe-4541-89a9-ce86905b94ec.mock.pstmn.io/disputes/' + id + '/subscribe')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDisputeOccurrences ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://c04e5875-40fe-4541-89a9-ce86905b94ec.mock.pstmn.io/disputes/' + id + '/occurrences')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDisputeRoles ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('disputes/' + id + '/dispute-roles/list')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
  }
}

export default dispute
