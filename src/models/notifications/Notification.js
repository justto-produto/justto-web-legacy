export default class Notification {
  constructor({
    name,
    quantity,
    tab,
    type,
    filter
  }) {
    this.name = name
    this.quantity = quantity
    this.tab = tab
    this.type = type
    this.filter = filter
  }

  get hasItems() {
    return this.quantity !== 0
  }
}
