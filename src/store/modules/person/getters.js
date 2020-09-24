import Isemail from 'isemail'

const getters = {
  loggedPerson: state => state.loggedPerson,
  loggedPersonName: state => {
    return state.loggedPerson.name
  },
  loggedPersonId: state => {
    return state.loggedPerson.id
  },
  loggedPersonPhone: state => {
    if (state.loggedPerson.phones) {
      const mainPhone = state.loggedPerson.phones.map(p => {
        if (p.isMain) return p
      })
      return mainPhone[0] || state.loggedPerson.phones[0] || null
    }
  },
  hasPersonName: state => {
    return !Isemail.validate(state.loggedPerson.name)
  },
}

export default getters
