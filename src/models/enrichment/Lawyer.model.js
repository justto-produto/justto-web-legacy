export class Lawyer {
  constructor({ name, oab, state, status, organization, phones, address, photo, addressComplement, addressNumber, relatedPersonName, personTags, dateOfBirth, uf, document, score, city, personType, normalizedName }) {
    this.name = name
    this.oab = oab
    this.state = state
    this.status = status
    this.organization = organization
    this.phones = (!phones || phones === 'false') ? null : phones
    this.address = address
    this.photo = photo
    this.addressComplement = addressComplement
    this.addressNumber = addressNumber
    this.relatedPersonName = relatedPersonName
    this.personTags = personTags
    this.dateOfBirth = dateOfBirth
    this.uf = uf
    this.document = document
    this.score = score
    this.city = city
    this.personType = personType
    this.normalizedName = normalizedName
  }
}
