import Vue from 'vue'

const personMutations = {
  setLoggedPerson(state, loggedPerson) {
    Vue.set(state, 'loggedPerson', loggedPerson)
    localStorage.setItem('jusperson', JSON.stringify(loggedPerson))
  },
  clearLoggedPerson(state) {
    state.loggedPerson = {}
  },
  setOnlineDocs(state, documents) {
    documents.map(doc => {
      /** Validação do CPF/CNPJ */
      if (doc.documentNumber && doc.online) {
        Vue.set(state.onlineDocuments, doc.documentNumber, 'ONLINE')
      } else if (state.onlineDocuments[doc.documentNumber]) {
        Vue.delete(state.onlineDocuments, doc.documentNumber)
      }
      /** Validação da OAB */
      if (doc.oabNumber && doc.oabState && doc.online) {
        Vue.set(state.onlineDocuments, `${doc.oabNumber}/${doc.oabState}`, 'ONLINE')
      } else if (state.onlineDocuments[`${doc.oabNumber}/${doc.oabState}`]) {
        Vue.delete(state.onlineDocuments, `${doc.oabNumber}/${doc.oabState}`)
      }
    })
  },
  clearOnlineDocs(state) {
    Vue.set(state, 'onlineDocuments', {})
  },

  setLoggedPersonName(state, name) {
    Vue.set(state.loggedPerson, 'name', name)
    localStorage.setItem('jusperson', JSON.stringify({ ...state.loggedPerson, name }))
  }
}

export default personMutations
