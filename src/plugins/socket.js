import Vue from 'vue'
import store from '@/store'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'wss://3f6a7e25.ngrok.io/workspaces/whatsapp/justto'
}))
