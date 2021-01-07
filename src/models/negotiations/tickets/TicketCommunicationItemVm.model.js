import TicketItemVm from './TicketItemVm.model'

class LastRecivedMessageVm {
  constructor({ dateTime, message }) {
    this.dateTime = dateTime
    this.message = message
  }
}

export class TicketCommunication extends TicketItemVm {
  constructor({ lastRecivedMessage }) {
    this.lastRecivedMessage = new LastRecivedMessageVm(lastRecivedMessage)
  }
}