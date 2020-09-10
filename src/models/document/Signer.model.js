export class SignerModel {
  constructor(documentNumber, name, emails, defaultSigner, disputeRoleId) {
    this._documentNumber = documentNumber
    this._name = name
    this._emails = emails
    this._defaultSigner = defaultSigner
    this._disputeRoleId = disputeRoleId
  }

  get name() {
    return this._name
  }

  get emails() {
    return this._emails
  }

  get defaultSigner() {
    return this._defaultSigner
  }

  get disputeRoleId() {
    return this._disputeRoleId
  }

  get documentNumber() {
    return this._documentNumber
  }
}
