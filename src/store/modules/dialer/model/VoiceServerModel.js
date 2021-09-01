/* eslint-disable camelcase */
import RequestCallCommand from './RequestCallCommand'

/**
 * VoiceServerModel is a representation of Voice Server utilized on Dialer to connect
 * @class
 * @constructor
 * @public
 */
export default class VoiceServerModel {
  rtcSignalingServer
  rtcMediaServer
  rtcSignalingPort
  rtcWsServer
  rtcURIAddr
  rtcUAUsername
  rtcUAPassword
  api_key
  caller_ident_external
  agent_id
  serviceStatus = []

  constructor(obj) {
    if (obj) Object.keys(obj).forEach(key => (this[key] = obj[key]))
  }

  createRequestCallCommand(destination) {
    return new RequestCallCommand({
      api_key: this.api_key,
      call_cid: this.caller_ident_external,
      call_destination: destination
    })
  }
}
