/* eslint-disable camelcase */
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
    this.user_name = 'lucas@justto.com.br'
    this.user_passwd = 'HWG49ig7CMqXHj#'
  }
}
