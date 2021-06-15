export default class PersonDto {
  constructor({ dead, id, name, documentNumber, namesake, vexatiousAuthor, vexatiousLawyer, vexatiousParty }) {
    this.id = id
    this.name = name || ''
    this.document = documentNumber || ''
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
    return this.namesake && this.document.length === 0
  }

  get isVexatious() {
    return this.vexatiousAuthor || this.vexatiousLawyer || this.vexatiousParty
  }
}
