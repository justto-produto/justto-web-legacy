import TicketItemVm from './TicketItemVm'
import DateTime from '../GenericClasses'

class LastInboundInteractionVm {
  constructor({ dateTime, message, type }) {
    this.dateTime = new DateTime(dateTime)
    this.message = message
    this.type = type
  }
}

export class TicketCommunication extends TicketItemVm {
  constructor({ lastInboundInteraction, expirationDate }) {
    super()
    this.expirationDate = expirationDate
    this.lastInboundInteraction = new LastInboundInteractionVm(lastInboundInteraction)
  }
}
