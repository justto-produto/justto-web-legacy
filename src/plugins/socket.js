import Vue from 'vue'
import store from '../store'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: process.env.VUE_APP_BASE_URL || location.hostname,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
  options: { path: '/websocket' }
}))
