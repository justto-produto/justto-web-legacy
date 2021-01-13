class ProposalVm {
  constructor({ value, ownerName }) {
    this.value = value
    this.ownerName = ownerName
  }
}

class StrategyVm {
  constructor({ id, name, type, triggerType }) {
    this.id = id
    this.name = name
    this.type = type
    this.triggerType = triggerType
  }
}

export class DisputeOverviewVm {
  constructor({ disputeId = null, code = null, internalIdentification = null, upperRange = null, status = '', description = '', strategy = '', plaintiffProposal = null, defendantProposal = null }) {
    this.disputeId = disputeId
    this.code = code
    this.internalId = internalIdentification
    this.upperRange = upperRange
    this.status = status
    this.description = description
    this.strategy = new StrategyVm(strategy)
    this.plaintiffProposal = new ProposalVm(plaintiffProposal)
    this.defendantProposal = new ProposalVm(defendantProposal)
  }
}
