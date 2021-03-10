class StrategyVm {
  constructor({ id, strategyId, isObrigacaoFazer, isManual }) {
    this.id = id || strategyId
    this.isObrigacaoFazer = isObrigacaoFazer
    this.isManual = isManual
  }
}

export default class DisputeOverviewVm {
  constructor({
    disputeId, id,
    internalId, externalId,
    code,
    status,
    description,
    paused,
    favorite,
    upperRange, disputeUpperRange,
    hasDraft, hasDocument,
    strategy, strategyId
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
    this.strategy = new StrategyVm(strategy || { strategyId })
  }
}
