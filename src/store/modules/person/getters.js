const disputeGetters = {
  currentPerson: state => state.currentPerson,
  currentPersonName: state => {
    return state.currentPerson.name
  },
  currentPersonId: state => {
    return state.currentPerson.id
  }
}

export default disputeGetters
