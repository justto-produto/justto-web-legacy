import { TARIFF_TYPES } from '@/constants/billing'

export class TariffModel {
  constructor(type, value) {
    if (!Object.keys(TARIFF_TYPES).includes(type)) {
      throw new Error('Use a valid tariff type!')
    }

    this.type = type
    this.value = value || TARIFF_TYPES[type].defaultValue
  }
}
