const getters = {
  whatsappStatus: state => state.whatsapp.status,
  whatsappQrCode: state => state.whatsapp.qrCode,
  whatsappNumber: state => state.whatsapp.number,
  disputeOccurrences: state => state.occurrence.list
}

export default getters
