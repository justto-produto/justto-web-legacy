export class SignerModel {
  constructor({ id, documentNumber, name, email }) {
    this.id = id
    this.name = name
    this.email = email
    this.documentNumber = documentNumber
    this._defaultSigner = true
  }

  get defaultSigner() {
    return this._defaultSigner
  }

  set defaultSigner(value) {
    this._defaultSigner = value
  }
}
