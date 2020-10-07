export const TARIFF_TYPES = Object.freeze({
  LAWSUIT_DROPPED: {
    label: 'Indicativo de baixa',
    defaultValue: 3
  },
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
