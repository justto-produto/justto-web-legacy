import moment from 'moment'

const getters = {
  whatsappStatus: state => state.whatsapp.status,
  whatsappQrCode: state => state.whatsapp.qrCode,
  whatsappNumber: state => state.whatsapp.number
}

export default getters
