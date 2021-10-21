import { axiosDispatch } from '@/utils'

const importsPath = 'api/imports'

const importActions = {
  getImportsHistory() {
    return axiosDispatch({ url: `${importsPath}/history` })
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
    return axiosDispatch({ url: `${importsPath}/${state.file.id}/tags` })
  },
  mapImportColumns({ state }, map) {
    return axiosDispatch({
      url: `${importsPath}/${state.file.id}/map`,
      method: 'PUT',
      data: map
    })
  },
  uploadImportFile({ _ }, file) {
    return axiosDispatch({
      url: `${importsPath}/upload`,
      method: 'POST',
      data: file
    })
  },
  startGeneseRunner({ state }) {
    return axiosDispatch({
      url: `api/geneserunner/${state.file.id}/start`,
      method: 'POST'
    })
  },

  validateGeneseRunner({ state }) {
    return axiosDispatch({ url: `api/geneserunner/${state.file.id}/validate` })
  },

  validateGeneseRunnerSummary({ state }) {
    return axiosDispatch({ url: `api/imports/${state.file.id}/resume?loadSummary=true&loadDisputes=false` })
  },

  setErrorFields({ commit }, fields) {
    commit('setErrorFields', fields)
  },
  clearErrorField({ commit }, filed) {
    commit('clearErrorField', filed)
  },
  startDuplicateValidations({ commit }) {
    commit('validationInProgress', true)
  },
  finishDuplicateValidations({ commit }) {
    commit('validationInProgress', false)
  }
}

export default importActions
