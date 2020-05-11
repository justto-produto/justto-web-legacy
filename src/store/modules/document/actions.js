import axiosDispatcher from '@/store/axiosDispatcher.js'
const FileSaver = require('file-saver')
const documents = 'api/office/documents/'

const actions = {
  getDocumentModels ({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(documents + 'model')
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  createDocumentByModel ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post(documents + params.modelId + '/' + params.disputeId)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getDocumentByDisputeId ({ commit }, disputeId) {
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
  setDocumentSigners ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post(documents + 'signer/' + params.disputeId, params.recipients).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  resendSignersNotification ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put(documents + 'resend-notification/' + params.disputeId).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteDocument ({ commit }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete(documents + disputeId).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addModel ({ commit }, url) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post(documents + `model?url=${url}`,  {}).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  editModel ({ commit }, model) {
    return axiosDispatcher({
      url: documents + 'model/',
      method: 'PUT',
      data: model
    })
  },
  deleteModel ({ commit }, modelId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete(documents + 'model/' + modelId).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  downloadDocument ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(documents + 'download-signed/' + params.disputeId, {
        responseType: 'arraybuffer'
      }).then(response => {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream'
        })
        let fileName = params.name + '.pdf'
        FileSaver.saveAs(blob, fileName)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDocumentTypes () {
    return axiosDispatcher({ url: documents + 'model/input/types' })
  }
}

export default actions
