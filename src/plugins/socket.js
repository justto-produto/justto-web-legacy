import Vue from 'vue'
import store from '../store'
import VueSocketIO from 'vue-socket.io'

// let hostname = 'kubernetes.justto.com.br/'
let hostname = location.hostname
let protocol = location.protocol === 'https:' ? 'wss://' : 'ws://'

Vue.use(new VueSocketIO({
  debug: true,
  connection: protocol + hostname,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
  options: { path: '/websocket' }
}))
