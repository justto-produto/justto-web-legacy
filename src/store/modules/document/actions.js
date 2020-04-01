import axiosDispatcher from '@/store/axiosDispatcher.js'
const FileSaver = require('file-saver')

const actions = {
  getDocumentModels ({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/documents/model')
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
      axios.post('api/documents/' + params.modelId + '/' + params.disputeId)
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
      axios.get('api/documents/' + disputeId)
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
      axios.post('api/documents/signer/' + params.disputeId, params.recipients).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  resendSignersNotification ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/documents/resend-notification/' + params.disputeId).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteDocument ({ commit }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete('api/documents/' + disputeId).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addModel ({ commit }, url) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post(`api/documents/model?url=${url}`,  {}).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  editModel ({ commit }, model) {
    return axiosDispatcher({
      url: 'api/documents/model/',
      method: 'PUT',
      data: model
    })
  },
  deleteModel ({ commit }, modelId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete('api/documents/model/' + modelId).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  downloadDocument ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/documents/download-signed/' + params.disputeId, {
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
    return axiosDispatcher({ url: 'api/documents/model/input/types' })
  }
}

export default actions
