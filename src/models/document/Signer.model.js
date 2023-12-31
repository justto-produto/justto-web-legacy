export class SignerModel {
  #id
  constructor({ id, documentNumber, name, email, defaultSigner = true }) {
    this.#id = id
    this.name = name
    this.emails = [{ address: email }]
    this.documentNumber = documentNumber
    this._defaultSigner = defaultSigner
  }

  get defaultSigner() {
    return this._defaultSigner
  }

  set defaultSigner(value) {
    this._defaultSigner = value
  }
}
