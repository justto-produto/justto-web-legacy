/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars

/**
 * RequestCallCommand is a command for create new call in voice server
 * @class
 * @constructor
 * @public
 */
export default class RequestCallCommand {
  api_key
  call_destination
  call_type
  call_cid
  call_recorder
  call_from_chat

  constructor({ api_key, call_destination, call_cid }) {
    this.api_key = api_key
    this.call_cid = call_cid
    this.call_destination = call_destination
    this.call_recorder = '1'
    this.call_from_chat = false
    this.call_type = 'external'
  }
}
