import { axiosDispatch } from '@/utils/'

const personsPath = 'api/persons'

const personActions = {
  SOCKET_REFRESH_PERSON_STATUS({ commit }, document) {
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

  changeLoggedPersonName({ _ }, { id, name }) {
    return axiosDispatch({
      url: `${personsPath}/${id}/name`,
      method: 'PUT',
      data: { name },
      commit: 'setLoggedPerson'
    })
  },

  changeLoggedPersonPhone({ commit }, phone) {
    const person = JSON.parse(localStorage.getItem('jusperson'))

    commit('setLoggedPerson', {
      ...person,
      phones: [phone]
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
  changeMemberName({ dispatch }, { name, personId }) {
    return axiosDispatch({
      url: `${personsPath}/${personId}/name`,
      method: 'PUT',
      data: { name }
    }).then(() => {
      dispatch('getWorkspaceTeam')
    })
  },
  updatePersonProfile({ dispatch }, { profile, personId }) {
    return axiosDispatch({
      url: `/api/workspaces/members/person/${personId}/${profile}`,
      method: 'PATCH'
    }).then(() => {
      dispatch('getWorkspaceTeam')
    })
  },
  searchPersonByDocument({ _ }, params) {
    return axiosDispatch({ url: `api/spider/person/${params.document}` })
  },
  searchPersonByOab({ _ }, params) {
    return axiosDispatch({ url: `api/spider/lawyer/${params.oabNumber}/${params.oabState}` })
  },
  enrichPerson({ _ }, personId) {
    return axiosDispatch({
      url: `api/fusion-runner/enrich/person/${personId}`,
      method: 'PATCH'
    })
  }
}

export default personActions
