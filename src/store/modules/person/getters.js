const disputeGetters = {
  currentPerson: state => state.currentPerson,
  currentPersonName: state => {
    return state.currentPerson.name
  },
  currentPersonId: state => {
    return state.currentPerson.id
  },
  currentPersonPhone: state => {
    if (state.currentPerson.phones) {
      const mainPhone = state.currentPerson.phones.map(p => {
        if (p.isMain) return p
      })
      return mainPhone[0] || state.currentPerson.phones[0] || null
    }
  }
}

export default disputeGetters
