import Vue from 'vue'

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
    state.whatsapp.qrCode = message.qrCode
    state.whatsapp.status = message.status
    state.whatsapp.number = message.phone
  },
  // OCCURRENCE
  SOCKET_ADD_OCCURRENCE (state, newOccurrence) {
    Vue.nextTick(() => {
      let occurrenceIndex = state.occurrence.list.findIndex(d => newOccurrence.id === d.id)
      if (occurrenceIndex === -1) {
        state.occurrence.list.push(newOccurrence)
      } else {
        Vue.set(state.occurrence.list, occurrenceIndex, newOccurrence)
      }
    })
  },
  clearDisputeOccurrence (state) {
    state.occurrence.list = []
  }
}

export default mutations
