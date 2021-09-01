/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars

/**
 * DialerUserModel is a representation of user to authentication in dialer server
 * @class
 * @constructor
 * @public
 */
export default class DialerUserModel {
  user_name;

  user_passwd;

  token;

  constructor() {
    this.user_name = 'demo2@inov8.cloud'
    this.user_passwd = '654321'
  }
}
