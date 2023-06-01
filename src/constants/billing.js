export const TARIFF_TYPES = Object.freeze({
  IMPORTED_DISPUTE: {
    label: 'Importação',
    defaultValue: 0
  },
  INTERACTION: {
    label: 'Interação',
    defaultValue: 12
  },
  DISPUTE_ACCEPTED: {
    label: 'Disputa aceita',
    defaultValue: 18
  },
  SETTLED_DISPUTE: {
    label: 'Acordo fechado',
    defaultValue: 300
  },
  LAWSUIT_DROPPED: {
    label: 'Pré negociação',
    defaultValue: 3
  }
})

export const FRANCHISE_TARIFF_TYPES = Object.freeze({
  IMPORTED_DISPUTE_LIMITED: {
    label: 'Limete de Importação',
    defaultValue: 0
  },
  INTERACTION_LIMITED: {
    label: 'Limite de Interação',
    defaultValue: 12
  },
  DISPUTE_ACCEPTED_LIMITED: {
    label: 'Limite de Disputa aceita',
    defaultValue: 18
  },
  SETTLED_DISPUTE_LIMITED: {
    label: 'Limite de Acordo fechado',
    defaultValue: 300
  },
  LAWSUIT_DROPPED_LIMITED: {
    label: 'Limite de Pré negociação',
    defaultValue: 3
  }
})

export const CONTRACT_STATUS = Object.freeze({
  ACTIVE: {
    key: 'ACTIVE',
    label: 'Ativo'
  },
  TRIAL: {
    key: 'TRIAL',
    label: 'Trial'
  },
  INACTIVE: {
    key: 'INACTIVE',
    label: 'Inativo'
  }
})
