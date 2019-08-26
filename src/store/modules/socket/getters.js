import moment from 'moment'

const getters = {
  whatsappStatus: state => state.whatsapp.status,
  whatsappQrCode: state => state.whatsapp.qrCode,
  whatsappNumber: state => state.whatsapp.number,
  disputeOccurrences: state => state.occurrence.list.sort((a, b) => {
    if (moment(a.createAt.dateTime).isAfter(b.createAt.dateTime)) return 1
    if (moment(a.createAt.dateTime).isBefore(b.createAt.dateTime)) return -1
    return a.id < b.id
  })
}

export default getters
