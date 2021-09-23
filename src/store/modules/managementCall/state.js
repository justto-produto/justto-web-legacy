export default {
  appInstance: null, // Inserir valor ao habilitar Discador.
  callQueue: [],
  requestProvideNewInterval: null, // setIntervalObject(),
  timeoutDialerDetail: null, // setTimeoutDialerDetail(),
  callHeartbeatInterval: null, // setIntervalObject(),
  broadcastRequestCallStatus: null, // setTimeoutCallStatus(),
  activeToCall: false,
  dialer: null,
  currentCall: null,
  sharedManagementCall: {
    appInstance: null,
    callQueue: [],
    currentCall: null
  }
}
