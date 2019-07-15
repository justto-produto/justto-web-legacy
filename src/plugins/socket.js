import Vue from 'vue'
import store from '../store'
import VueSocketIO from 'vue-socket.io'

const HOSTNAME = process.env.VUE_APP_BASE_URL || location.hostname
const PROTOCOL = location.protocol === 'https:' ? 'wss://' : 'ws://'

Vue.use(new VueSocketIO({
  debug: true,
  connection: PROTOCOL + HOSTNAME,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
  options: { path: '/websocket' }
}))
