/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars

/**
 * RequestMemberStatusCommand is a command to set new status to logged user
 * @class
 * @constructor
 * @public
 */
export default class RequestMemberStatusCommand {
  _service_member_status

  constructor({ service_member_status }) {
    this._service_member_status = service_member_status
  }
}
