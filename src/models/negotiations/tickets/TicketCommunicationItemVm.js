import TicketItemVm from './TicketItemVm'
import { DateTime } from '../GenericClasses'

class LastInboundInteractionVm {
  constructor({ dateTime, message, type }) {
    this.dateTime = new DateTime(dateTime)
    this.message = message
    this.type = type
  }
}

export default class TicketCommunicationItemVm extends TicketItemVm {
  constructor(dispute) {
    const { expirationDate, lastInboundInteraction, lastReceivedMessage } = dispute
    super(dispute)
    this.expirationDate = expirationDate.dateTime
    this.lastInboundInteraction = new LastInboundInteractionVm(lastInboundInteraction || {
      dateTime: lastReceivedMessage?.createAt,
      message: lastReceivedMessage?.message?.resume,
      type: lastReceivedMessage?.type
    })
  }
}
