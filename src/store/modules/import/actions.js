import axiosDispatcher from '@/store/axiosDispatcher'

const importsPath = 'api/imports'

const importActions = {
  getImportsHistory() {
    return axiosDispatcher({ url: `${importsPath}/history` })
  },
  getImportsColumns({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(`${importsPath}/${state.file.id}/columns`)
        .then(response => {
          if (response.status === 204) {
            setTimeout(function() {
              resolve(dispatch('getImportsColumns'))
            }, 3000)
          } else {
            commit('setImportsMap', response.data)
            resolve()
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getImportsTags({ state }) {
    return axiosDispatcher({ url: `${importsPath}/${state.file.id}/tags` })
  },
  mapImportColumns({ state }, map) {
    return axiosDispatcher({
      url: `${importsPath}/${state.file.id}/map`,
      method: 'PUT',
      data: map
    })
  },
  uploadImportFile({ _ }, file) {
    return axiosDispatcher({
      url: `${importsPath}/upload`,
      method: 'POST',
      data: file
    })
  },
  startGeneseRunner({ state }) {
    return axiosDispatcher({
      url: `api/geneserunner/${state.file.id}/start`,
      method: 'POST'
    })
  },
  validateGeneseRunner({ state }) {
    return axiosDispatcher({ url: `api/geneserunner/${state.file.id}/validate` })
  },
  setErrorFields({ commit }, fields) {
    commit('setErrorFields', fields)
  },
  clearErrorField({ commit }, filed) {
    commit('clearErrorField', filed)
  }
}

export default importActions
