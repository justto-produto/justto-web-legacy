import axiosDispatcher from '@/store/axiosDispatcher'

const personsPath = 'api/persons'

const personActions = {
  getPerson({ _ }, id) {
    return axiosDispatcher({ url: `${personsPath}/${id}` })
  },
  refreshPerson({ _ }, id) {
    return axiosDispatcher({
      url: `${personsPath}/${id}`,
      mutation: 'setLoggedPerson'
    })
  },
  setMainPhone({ _ }, params) {
    return axiosDispatcher({
      url: `${personsPath}/${params.personId}/phones/main`,
      method: 'POST',
      data: params.phoneDTO
    })
  },
  changePersonName({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put(`${personsPath}/${params.person.id}/name`, {
        name: params.person.name
      }).then(response => {
        if (params.isEditingLoggedPerson) commit('setLoggedPerson', response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  searchPersonByDocument({ _ }, params) {
    return axiosDispatcher({ url: `api/spider/person/${params.document}` })
  },
  searchPersonByOab({ _ }, params) {
    return axiosDispatcher({ url: `api/spider/lawyer/${params.oabNumber}/${params.oabStat}` })
  },
  enrichPerson({ _ }, personId) {
    return axiosDispatcher({
      url: `api/fusion-runner/enrich/person/${personId}`,
      method: 'PATCH'
    })
  }
}

export default personActions
