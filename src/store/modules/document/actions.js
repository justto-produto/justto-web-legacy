import axiosDispatcher from '@/store/axiosDispatcher.js'

const FileSaver = require('file-saver')
const documentsPath = 'api/office/documents'

/**
 * Dispatch Actions
 * @type {Promise}
 * @param {string} url - the end-point reqeust
 * @param {string} method - the method of requesr (default is 'GET')
 * @param {Object, array} data - the params  of request
 */

const documentActions = {
  getDocumentModels({ _ }) {
    return axiosDispatcher({ url: `${documentsPath}/model` })
  },
  createDocumentByModel({ _ }, params) {
    return axiosDispatcher({
      url: `${documentsPath}/${params.modelId}/${params.disputeId}`,
      method: 'POST'
    })
  },
  getDocumentByDisputeId({ _ }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(`${documentsPath}/${disputeId}`)
        .then(response => {
          if (response.status === 204) {
            resolve(null)
          } else resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setDocumentSigners({ _ }, params) {
    return axiosDispatcher({
      url: `${documentsPath}/signer/${params.disputeId}`,
      method: 'POST',
      data: params.recipients
    })
  },
  resendSignersNotification({ _ }, params) {
    return axiosDispatcher({
      url: `${documentsPath}/resend-notification/${params.disputeId}`,
      method: 'PUT'
    })
  },
  deleteDocument({ _ }, disputeId) {
    return axiosDispatcher({
      url: `${documentsPath}/${disputeId}`,
      method: 'DELETE'
    })
  },
  backDocumentToEditing({ _ }, disputeId) {
    return axiosDispatcher({
      url: `${documentsPath}/${disputeId}/back-to-editing`,
      method: 'PATCH'
    })
  },
  addModel({ _ }, url) {
    return axiosDispatcher({
      url: `${documentsPath}/model?url=${url}`,
      method: 'POST',
      data: {}
    })
  },
  editModel({ _ }, model) {
    return axiosDispatcher({
      url: `${documentsPath}/model`,
      method: 'PUT',
      data: model
    })
  },
  deleteModel({ _ }, modelId) {
    return axiosDispatcher({
      url: `${documentsPath}/model/${modelId}`,
      method: 'DELETE'
    })
  },
  downloadDocument({ _ }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(`${documentsPath}/download-signed/${params.disputeId}`, {
        responseType: 'arraybuffer'
      }).then(response => {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream'
        })
        const fileName = params.name + '.pdf'
        FileSaver.saveAs(blob, fileName)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDocumentTypes() {
    return axiosDispatcher({ url: `${documentsPath}/model/input/types` })
  },
  getDefaultAssigners({ _ }) {
    return axiosDispatcher({
      url: `${documentsPath}/signer`,
      mutation: 'createFromDefaultSigners'
    })
  },
  setSelectedSigners({ commit }, signers) {
    commit('setSelectedSigners', Object.values(signers))
  },
  cleanSelectedSigners({ commit }) {
    commit('setSelectedSigners', [])
  }
}

export default documentActions
