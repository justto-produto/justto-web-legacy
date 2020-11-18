const personGetters = {
  loggedPerson: state => state.loggedPerson,
  loggedPersonName: state => state.loggedPerson.name,
  loggedPersonHasName: state => state.loggedPerson.name && state.loggedPerson.name.length > 2 && !state.loggedPerson.name.includes('@'),
  loggedPersonId: state => state.loggedPerson.id,
  loggedPersonPhone: state => {
    if (state.loggedPerson.phones) {
      const mainPhone = state.loggedPerson.phones.map(p => {
        if (p.isMain) return p
      })
      return mainPhone[0] || state.loggedPerson.phones[0] || null
    }
  },
  onlineDocuments: state => state.onlineDocuments
}

export default personGetters
