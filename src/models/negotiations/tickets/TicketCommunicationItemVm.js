import TicketItemVm from './TicketItemVm'
import { DateTime } from '../GenericClasses'

class LastInboundCommunicationVm {
  constructor({ dateTime, createAt, message, type }) {
    this.dateTime = new DateTime(dateTime || createAt || {})
    this.message = message?.resume || message
    this.type = type
  }
}

export default class TicketCommunicationItemVm extends TicketItemVm {
  constructor(dispute) {
    const { lastReceivedMessage, lastInboundInteraction } = dispute
    super(dispute)
    this.lastInboundInteraction = new LastInboundCommunicationVm(lastInboundInteraction || {})
    this.lastReceivedMessage = new LastInboundCommunicationVm(lastReceivedMessage || {})
  }
}
