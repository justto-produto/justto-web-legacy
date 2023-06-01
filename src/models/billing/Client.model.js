// eslint-disable-next-line no-unused-vars
import { ContractModel } from './Contract.model'

/**
 * ClientModel is a client abstraction
 * @class
 * @constructor
 * @public
 */
export class ClientModel {
  /**
   * @type {Array<ContractModel>}
   * @private
   */
  #contracts
  /**
   * @type {number}
   * @private
   */
  #customerId
  /**
   * @type {string}
   * @private
   */
  #customerName
  /**
   * @type {Array<any>}
   * @private
   */
  #transactions
  /**
   * @type {Number}
   * @private
   */
  #monthlySubscriptionFee

  constructor({
    contracts = [],
    customerId,
    customerName,
    transactions,
    monthlySubscriptionFee
  }) {
    this.#contracts = contracts
    this.#customerId = customerId
    this.#customerName = customerName
    this.#transactions = transactions
    this.#monthlySubscriptionFee = monthlySubscriptionFee || 0
  }

  get contracts() {
    return this.#contracts
  }

  set contracts(value) {
    this.#contracts = value
  }

  get customerId() {
    return this.#customerId
  }

  get customerName() {
    return this.#customerName || ''
  }

  set customerName(value) {
    this.#customerName = value
  }

  get transactions() {
    return this.#transactions
  }

  set transactions(value) {
    this.#transactions = value
  }

  get monthlySubscriptionFee() {
    return this.#monthlySubscriptionFee || 0
  }

  set monthlySubscriptionFee(value) {
    this.#monthlySubscriptionFee = value
  }
}
