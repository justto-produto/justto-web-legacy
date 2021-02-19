/* eslint-disable */
import { PlanModel } from './Plan.model'
import { TariffModel } from './Tariff.model'
/* eslint-enable */

/**
 * @class ContractModel
 */
export class ContractModel {
  /**
   * @param {string} status Contract status
   * @param {string} startedDate Contract date of start
   * @param {number} invoiceDueDays Invoice day
   * @param {number} invoiceClosingDay Closing day
   * @param {PlanModel} plan Contract plan
   * @param {number} monthlySubscriptionFee Montlhy payment
   * @param {Array<TariffModel>} tariffs List of tariffs
   */
  constructor(
    {
      id,
      status = 'ACTIVE',
      startedDate = '',
      invoiceDueDays = 10,
      invoiceClosingDay = 0,
      grossValueTax = 0,
      onlendingFee = 0,
      plan,
      monthlySubscriptionFee,
      tariffs = []
    }) {
    this._id = id
    this._status = status
    this._startedDate = startedDate
    this._invoiceDueDays = invoiceDueDays
    this._invoiceClosingDay = invoiceClosingDay
    this._plan = plan
    this._monthlySubscriptionFee = monthlySubscriptionFee
    this._tariffs = tariffs
    this._grossValueTax = grossValueTax
    this._onlendingFee = onlendingFee
  }

  get id() {
    return this._id
  }

  get status() {
    return this._status
  }

  get startedDate() {
    return this._startedDate
  }

  get invoiceDueDays() {
    return this._invoiceDueDays
  }

  get invoiceClosingDay() {
    return this._invoiceClosingDay
  }

  get plan() {
    return this._plan
  }

  get monthlySubscriptionFee() {
    return this._monthlySubscriptionFee
  }

  get tariffs() {
    return this._tariffs
  }

  set status(status) {
    this._status = status
  }

  set startedDate(startedDate) {
    this._startedDate = startedDate
  }

  set invoiceDueDays(invoiceDueDays) {
    this._invoiceDueDays = invoiceDueDays
  }

  set invoiceClosingDay(invoiceClosingDay) {
    this._invoiceClosingDay = invoiceClosingDay
  }

  set plan(plan) {
    this._plan = plan
  }

  set monthlySubscriptionFee(monthlySubscriptionFee) {
    this._monthlySubscriptionFee = monthlySubscriptionFee
  }

  set tariffs(tariffs) {
    this._tariffs = tariffs
  }

  get grossValueTax() {
    return this._grossValueTax
  }

  set grossValueTax(grossValueTax) {
    this._grossValueTax = grossValueTax
  }

  get onlendingFee() {
    return this._onlendingFee
  }

  set onlendingFee(onlendingFee) {
    this._onlendingFee = onlendingFee
  }
}
