import { axiosDispatch } from '@/utils/'

const personsPath = 'api/persons'

const personActions = {
  SOCKET_REFRESH_PERSON_STATUS({ commit }, document) {
    console.log('REFRESH_PERSON_STATUS', document)
    commit('setOnlineDocs', [document])
  },
  getPerson({ _ }, id) {
    return axiosDispatch({ url: `${personsPath}/${id}` })
  },
  refreshPerson({ _ }, id) {
    return axiosDispatch({
      url: `${personsPath}/${id}`,
      mutation: 'setLoggedPerson'
    })
  },
  setMainPhone({ _ }, params) {
    return axiosDispatch({
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
    return axiosDispatch({ url: `api/spider/person/${params.document}` })
  },
  searchPersonByOab({ _ }, params) {
    return axiosDispatch({ url: `api/spider/lawyer/${params.oabNumber}/${params.oabStat}` })
  },
  enrichPerson({ _ }, personId) {
    return axiosDispatch({
      url: `api/fusion-runner/enrich/person/${personId}`,
      method: 'PATCH'
    })
  }
}

export default personActions
