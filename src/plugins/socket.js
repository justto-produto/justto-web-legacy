import Vue from 'vue'
import { Client, StompSubscription } from '@stomp/stompjs' // Message
import store from '../store'

const VueStompJs = {
  install (Vue, options) {
    const client = new Client()
    client.brokerURL = options.brokerURL
    client.onConnect = function (frame) {
      console.info('Connected at ' + client.brokerURL)
    }
    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
    }
    client.activate()
    let whatsappRefresh = new StompSubscription()
    Vue.prototype.$stomp = {
      subscribe (workspace) {
        console.log(workspace)
        whatsappRefresh = client.subscribe('/whatsapp/refresh/' + client.workspace, function (message) {
          const payload = JSON.parse(message.body)
          console.log(payload)
          console.log(payload.urlQrCode)
          store.commit('setMessage', payload.urlQrCode)
          console.log('payload.urlQrCode')
        })
      },
      unsubscribe () {
        console.log(whatsappRefresh)
        // whatsappRefresh.unsubscribe()
      },
      message: ''
    }
  }
}

Vue.use(VueStompJs, { brokerURL: 'ws://dev-env.acordo.pro/workspace/websocket' })
