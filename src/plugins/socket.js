 import Vue from 'vue'
 import { Client } from '@stomp/stompjs'
 import store from '../store'

 const VueStompJs = {
   install (Vue, options) {

     const whatsappClient = new Client()
     const chatClient = new Client()

     whatsappClient.brokerURL = options.brokerURL + '/workspace'
     chatClient.brokerURL = options.brokerURL + '/dispute'

     whatsappClient.onConnect = function (frame) {
       console.info('Connected at ' + whatsappClient.brokerURL)
     }
     whatsappClient.onStompError = function (frame) {
       console.error('Broker reported error: ' + frame.headers['message'])
       console.error('Additional details: ' + frame.body)
     }
     chatClient.onConnect = function (frame) {
       console.info('Connected at ' + chatClient.brokerURL)
     }
     chatClient.onStompError = function (frame) {
       console.error('Broker reported error: ' + frame.headers['message'])
       console.error('Additional details: ' + frame.body)
     }

     whatsappClient.activate()
     chatClient.activate()

     Vue.prototype.$jusSocket = {
       subscribeWhatsapp () {
         whatsappClient.subscribe('/whatsapp/refresh/' + store.state.workspaceModule.id, function (message) {
           store.commit('setWhatsappSocketMessage', JSON.parse(message.body))
         })
       },
       unsubscribeWhatsapp () {
         whatsappClient.unsubscribe()
       },
       subscribeChat (disputeId) {
         chatClient.subscribe('/' + disputeId + '/chat', function (message) {
           // store.commit('setWhatsappSocketMessage', JSON.parse(message.body))
         })
       },
       unsubscribeChat () {
         chatClient.unsubscribe()
       },
     }
   }
 }

 let hostname = 'justto.app' // window.location.hostname
 let protocol = location.protocol === 'https:' ? 'wss://' : 'ws://'
 Vue.use(VueStompJs, { brokerURL: protocol + hostname + '/websocket' })
