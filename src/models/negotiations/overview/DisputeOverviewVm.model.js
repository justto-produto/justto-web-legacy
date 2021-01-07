class Proposal {
  constructor({ value, ownerName }) {
    this.value = value
    this.ownerName = ownerName
  }
}

class Strategy {
  constructor({ id, name, triggerType}) {
    this.id = id
    this.name = name
    this.triggerType = triggerType
  }
}

export class DisputeOverviewVm {
  constructor({ id, code, internalIdentification, upperRange, status, description, strategy, plaintiffProposal, defendantProposal }) {
    this.id = id
    this.code = code
    this.internalId = internalIdentification
    this.upperRange = upperRange
    this.status = status
    this.description = description
    this.strategy = new Strategy(strategy)
    this.plaintiffProposal = new Proposal(plaintiffProposal)
    this.defendantProposal = new Proposal(defendantProposal)
  }
}