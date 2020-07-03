import { TARIFF_TYPES } from '@/constants/billing'

export class TariffModel {
  constructor({ id, type, value = 0 }) {
    if (!Object.keys(TARIFF_TYPES).includes(type)) {
      throw new Error('Use a valid tariff type!')
    }

    this.id = id
    this.type = type
    this.value = parseInt(value.toString() || TARIFF_TYPES[type].defaultValue)
  }
}
