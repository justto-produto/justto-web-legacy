const mutations = {
  // CHAT
  SOCKET_join (state, join) {
    state.chat.join = join
  },
  SOCKET_type (state, typing) {
    state.chat.typing = typing
  },
  SOCKET_message (state, message) {
    state.chat.message = message
  },
  SOCKET_leave (state, leave) {
    state.chat.leave = leave
  },
  clearTyping (state) {
    state.chat.typing = null
  },
  // WHATSAPP
  clearWhatsappSocket (state) {
    state.qrCode = ''
    state.status = 'OFFLINE'
    state.number = ''
  },
  SOCKET_refresh (state, message) {
    if (message.qrCode) state.whatsapp.qrCode = message.qrCode
    if (message.status) state.whatsapp.status = message.status
    if (message.phone) state.whatsapp.number = message.phone
  },
  // DISPUTE
  setDisputeLastIdChanged (state, id) {
    if (id) state.dispute.lastIdChanged = id
  }
}

export default mutations
