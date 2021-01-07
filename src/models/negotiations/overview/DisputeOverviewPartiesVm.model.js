class PersonData {
  constructor({ enriched = false, isValid = false, isMain = false, source = '' }) {
    this.enriched = enriched
    this.isValid = isValid
    this.isMain = isMain
    this.source = source
  }
}

class Phone extends PersonData {
  constructor({ number, mobile }) {
    this.number = number
    this.mobile = mobile
  }
}

class Email extends PersonData {
  constructor({ address }) {
    this.address = address
  }
}

class Oab extends PersonData {
  constructor({ number, state }) {
    this.number = number
    this.state = state
  }
}

export class DisputeOverviewPartiesVm {
  constructor({ personId, name, documentNumber, personType, party, roles, phones, emails, oabs }) {
    this.personId = personId
    this.name = name
    this.alias
    this.documentNumber = documentNumber
    this.locales
    this.personType = personType
    this.party = party
    this.roles = roles
    this.phones = phones.map(phone => new Phone(phone))
    this.emails = emails.map(email => new Email(email))
    this.oabs = oabs.map(oab => new Oab(oab))
  }
}