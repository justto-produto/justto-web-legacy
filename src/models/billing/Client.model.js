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
  _contracts
  /**
   * @type {number}
   * @private
   */
  _customerId
  /**
   * @type {string}
   * @private
   */
  _customerName
  /**
   * @type {Array<any>}
   * @private
   */
  _transactions

  constructor({
    contracts = [],
    customerId,
    customerName,
    transactions
  }) {
    this._contracts = contracts
    this._customerId = customerId
    this._customerName = customerName
    this._transactions = transactions
  }

  get contracts() {
    return this._contracts
  }

  set contracts(value) {
    this._contracts = value
  }

  get customerId() {
    return this._customerId
  }

  get customerName() {
    return this._customerName
  }

  set customerName(value) {
    this._customerName = value
  }

  get transactions() {
    return this._transactions
  }

  set transactions(value) {
    this._transactions = value
  }
}
