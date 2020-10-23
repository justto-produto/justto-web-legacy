const socketMutations = {
  // CHAT
  SOCKET_join(state, join) {
    state.chat.join = join
  },
  SOCKET_type(state, typing) {
    state.chat.typing = typing
  },
  SOCKET_message(state, message) {
    state.chat.message = message
  },
  SOCKET_leave(state, leave) {
    state.chat.leave = leave
  },
  clearTyping(state) {
    state.chat.typing = null
  }
}

export default socketMutations
