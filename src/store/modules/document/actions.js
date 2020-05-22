import axiosDispatcher from '@/store/axiosDispatcher.js'
const FileSaver = require('file-saver')
const documents = 'api/office/documents/'

/**
 * Dispatch Actions
 * @type {Promise}
 * @param {string} url - the end-point reqeust
 * @param {string} method - the method of requesr (default is 'GET')
 * @param {Object, array} data - the params  of request
 */

const actions = {
  getDocumentModels({ commit }) {
    return axiosDispatcher({ url: documents + 'model' })
  },
  createDocumentByModel({ commit }, params) {
    return axiosDispatcher({
      url: documents + params.modelId + '/' + params.disputeId,
      method: 'POST',
    })
  },
  getDocumentByDisputeId({ commit }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(documents + disputeId)
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
  setDocumentSigners({ commit }, params) {
    return axiosDispatcher({
      url: documents + 'signer/' + params.disputeId,
      method: 'POST',
      data: params.recipients,
    })
  },
  resendSignersNotification({ commit }, params) {
    return axiosDispatcher({
      url: documents + 'resend-notification/' + params.disputeId,
      method: 'PUT',
    })
  },
  deleteDocument({ commit }, disputeId) {
    return axiosDispatcher({
      url: documents + disputeId,
      method: 'DELETE',
    })
  },
  addModel({ commit }, url) {
    return axiosDispatcher({
      url: documents + `model?url=${url}`,
      method: 'POST',
      data: {},
    })
  },
  editModel({ commit }, model) {
    return axiosDispatcher({
      url: documents + 'model/',
      method: 'PUT',
      data: model,
    })
  },
  deleteModel({ commit }, modelId) {
    return axiosDispatcher({
      url: documents + 'model/' + modelId,
      method: 'DELETE',
    })
  },
  downloadDocument({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(documents + 'download-signed/' + params.disputeId, {
        responseType: 'arraybuffer',
      }).then(response => {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream',
        })
        let fileName = params.name + '.pdf'
        FileSaver.saveAs(blob, fileName)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDocumentTypes() {
    return axiosDispatcher({ url: documents + 'model/input/types' })
  },
}

export default actions
