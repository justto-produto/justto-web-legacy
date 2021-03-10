class ProposalVm {
  constructor({ roleId, value, name }) {
    this.roleId = roleId
    this.value = value
    this.name = name
  }
}

export default class LastOfferVm {
  constructor({
    defendantOffer,
    lastOfferRoleId,
    lastOfferValue,
    lastOfferName,
    plaintiffOffer,
    lastCounterOfferValue,
    lastCounterOfferName
  }) {
    this.defendantOffer = new ProposalVm(defendantOffer || {
      roleId: lastOfferRoleId,
      value: lastOfferValue,
      name: lastOfferName
    })
    this.plaintiffOffer = new ProposalVm(plaintiffOffer || {
      roleId: '',
      value: lastCounterOfferValue,
      name: lastCounterOfferName
    })
  }
}
