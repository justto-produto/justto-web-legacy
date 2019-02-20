import Vue from 'vue'
import { Client } from '@stomp/stompjs'
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
    Vue.prototype.$stomp = {
      subscribe (workspace) {
        console.log(workspace)
        client.subscribe('/whatsapp/refresh/' + workspace, function (message) {
          console.log('mensagem:' + message)
          store.commit('setWhatsappSocketMessage', JSON.parse(message.body))
        })
      },
      unsubscribe () {
        client.unsubscribe()
      }
    }
  }
}

Vue.use(VueStompJs, { brokerURL: 'ws://justto.app/workspace/websocket' })
