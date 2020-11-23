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
      if (doc.documentNumber) {
        if (doc.online) {
          state.onlineDocuments[doc.documentNumber] = 'ONLINE'
        } else {
          if (state.onlineDocuments[doc.documentNumber]) {
            delete state.onlineDocuments[doc.documentNumber]
          }
        }
      } if (doc.oab) {
        if (doc.online) {
          state.onlineDocuments[doc.oab] = 'ONLINE'
        } else {
          if (state.onlineDocuments[doc.oab]) {
            delete state.onlineDocuments[doc.oab]
          }
        }
      }
    })
  },
  clearOnlineDocs(state) {
    Vue.set(state, 'onlineDocuments', {})
  }
}

export default personMutations
