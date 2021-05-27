class Person {
  constructor({ dead, id, namesake, vexatiousAuthor, vexatiousLawyer, vexatiousParty }) {
    this.id = id
    this.dead = Boolean(dead)
    this.namesake = Boolean(namesake)
    this.vexatiousAuthor = Boolean(vexatiousAuthor)
    this.vexatiousLawyer = Boolean(vexatiousLawyer)
    this.vexatiousParty = Boolean(vexatiousParty)
  }

  get isDead() {
    return this.dead
  }

  get isNamesake() {
    return this.namesake
  }

  get isVexatious() {
    return this.vexatiousAuthor || this.vexatiousLawyer || this.vexatiousParty
  }
}

export default class TicketTicketOverviewPartyResumed {
  constructor({ disputeRoleId, documentNumber, name, oabs, polarity, roles, status, person }) {
    this.disputeRoleId = disputeRoleId
    this.documentNumber = documentNumber || ''
    this.name = name || ''
    this.oabs = oabs || []
    this.polarity = polarity || ''
    this.roles = roles || []
    this.status = status || ''
    this.person = new Person(person || { id: 0 })
  }

  get bankAccountMockup() {
    return {
      name: this.name || '',
      document: this.documentNumber || ''
    }
  }

  get hasDocumentNumber() {
    return !!this.documentNumber
  }

  get personId() {
    return this.person.id
  }

  get isClaimant() {
    return this.polarity === 'CLAIMANT'
  }

  get documentType() {
    return this.documentNumber.length <= 14 ? 'CPF' : 'CNPJ'
  }

  get isDead() {
    return this.person.isDead
  }

  get isVexatious() {
    return this.person.isVexatious
  }

  get isNamesake() {
    return this.person.isNamesake
  }

  get hasAlert() {
    return (this.isDead || this.isVexatious || this.isNamesake) && this.polarity === 'CLAIMANT'
  }

  get alertColor() {
    return this.isDead ? '#FF4B54' : '#FF9300'
  }
}
