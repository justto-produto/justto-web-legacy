const actions = {
  getPerson ({ commit }, id) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/persons/' + id)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setPhone ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/persons/' + params.personId + '/phones', params.phoneDTO)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  changePersonName ({ commit }, person) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/persons/' + person.id + '/name', {
        name: person.name
      }).then(response => {
        commit('setLoggedPerson', response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default actions
