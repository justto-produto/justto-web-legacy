import { Client, Message } from '@stomp/stompjs'
const client = new Client()
client.brokerURL = "ws://b43fdaa2.ngrok.io/workspaces"
console.log(client.brokerURL)

client.onConnect = function(frame) {
  console.log(frame)
  const subscription = client.subscribe('/whatsapp/refresh/teste', function (message) {
    const payload = JSON.parse(message.body);
    displayIncomingMessage(payload.user, payload.message);
  });
}


client.onStompError = function (frame) {
  // Will be invoked in case of error encountered at Broker
  // Bad login/passcode typically will cause an error
  // Complaint brokers will set `message` header with a brief message. Body may contain details.
  // Compliant brokers will terminate the connection after any error
  console.log('Broker reported error: ' + frame.headers['message'])
  console.log('Additional details: ' + frame.body)
}




var callback = function(message) {
  // called when the client receives a STOMP message from the server
  if (message.body) {
    alert("got message with body " + message.body)
  } else {
    alert("got empty message");
  }
};

client.activate()
