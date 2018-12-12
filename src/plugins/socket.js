import Vue from 'vue'
import { Client } from '@stomp/stompjs' // Message
import store from '../store'

const VueStompJs = {
  install (Vue, options) {
    const client = new Client()
    client.workspace = ''
    client.brokerURL = options.brokerURL
    client.onConnect = function (frame) {
      console.info('Connected at ' + client.brokerURL + ', chanel: ' + client.workspace + '.')
      client.subscribe('/whatsapp/refresh/' + client.workspace, function (message) {
        const payload = JSON.parse(message.body)
        console.log(payload)
        console.log(payload.urlQrCode)
        store.commit('setMessage', payload.urlQrCode)
      })
    }
    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
    }
    Vue.prototype.$stomp = {
      subscribe (workspace) {
        client.workspace = workspace
        client.activate()
      },
      unsubscribe () {
        client.unsubscribe()
        client.deactivate()
      },
      message: ''
    }
  }
}

Vue.use(VueStompJs, { brokerURL: 'ws://dev-env.acordo.pro/workspace/websocket' })
