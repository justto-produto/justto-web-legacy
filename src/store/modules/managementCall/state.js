export default {
  appInstance: null, // Inserir valor ao habilitar Discador.
  callQueue: [],
  requestProvideNewInterval: null, // setIntervalObject(),
  timeoutDialerDetail: null, // setTimeoutDialerDetail(),
  callHeartbeatInterval: null, // setIntervalObject(),
  scheduledCallInterval: null, // SetInterval()
  scheduledCallTimeout: null, // setTimeout()
  broadcastRequestCallStatus: null, // setTimeoutCallStatus(),
  activeToCall: false,
  dialer: null,
  currentCall: null,
  ignoreDialer: false,
  sharedManagementCall: {
    appInstance: null,
    callQueue: [],
    currentCall: null
  },
  sipConnection: {
    stack: null,
    session: null,
    socket: null,
    configuration: null,
    phone: null,
    speed: 0
  },
  // SAAS-4755
  scheduledCalls: {
    content: [],
    pageable: {},
    number: 0,
    totalPages: 1,
    totalElements: 1,
    last: true,
    first: true,
    empty: true
  }
}
