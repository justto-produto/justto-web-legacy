class StrategyVm {
  constructor({ id, isObrigacaoFazer, isManual }) {
    this.id = id
    this.isObrigacaoFazer = isObrigacaoFazer
    this.isManual = isManual
  }
}

export default class DisputeOverviewVm {
  constructor({
    disputeId,
    id,
    internalId,
    externalId,
    code,
    status,
    description,
    paused,
    favorite,
    upperRange,
    disputeUpperRange,
    hasDraft,
    hasDocument,
    signStatus,
    draftStatus,
    strategy,
    strategyId,
    hasOBFInStrategy,
    manualStrategy,
    lastReceivedMessage
  }) {
    this.disputeId = disputeId || id
    this.internalId = internalId || externalId
    this.code = code
    this.status = status
    this.description = description
    this.paused = paused
    this.favorite = favorite
    this.upperRange = upperRange || disputeUpperRange
    this.hasDraft = hasDraft || hasDocument
    this.draftStatus = signStatus || draftStatus
    this.strategy = new StrategyVm(strategy || {
      id: strategyId,
      isObrigacaoFazer: hasOBFInStrategy,
      isManual: manualStrategy
    })
    this.lastReceivedMessage = lastReceivedMessage || {}
  }
}
