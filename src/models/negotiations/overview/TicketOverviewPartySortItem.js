export default class TicketOverviewPartySortItem {
  constructor(party) {
    Object.assign(this, party)
  }

  get isParty() {
    return this.roles.includes('PARTY')
  }

  get isLawyer() {
    return this.roles.includes('LAWYER')
  }

  get isNegotiator() {
    return this.roles.includes('NEGOTIATOR')
  }

  get isUnknown() {
    return isNaN(this.polarity)
  }

  get isClaimant() {
    return this.polarity === 'CLAIMANT'
  }

  get isRespondent() {
    return this.polarity === 'RESPONDENT'
  }

  get rolesWeight() {
    if (this.isParty && !this.isLawyer) return 1
    else if (this.isParty && this.isLawyer) return 2
    else if (!this.isParty && this.isLawyer) return 3
    else if (this.isNegotiator) return 50
    return 60
  }

  get polarityWeight() {
    if (this.isClaimant) return 10
    else if (this.isRespondent) return 20
    else if (this.isUnknown) return 30
    return 40
  }
}
