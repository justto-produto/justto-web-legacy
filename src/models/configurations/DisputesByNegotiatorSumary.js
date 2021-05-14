export default class DisputesByNegotiatorSumary {
  constructor({
    ACCEPTED,
    CHECKOUT,
    ENGAGEMENT,
    EXPIRED,
    RUNNING
  }) {
    this.ACCEPTED = ACCEPTED || 0
    this.CHECKOUT = CHECKOUT || 0
    this.ENGAGEMENT = ENGAGEMENT || 0
    this.EXPIRED = EXPIRED || 0
    this.RUNNING = RUNNING || 0
  }
}
