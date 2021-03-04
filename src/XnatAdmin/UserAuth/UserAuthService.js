import Requestable from '../../Common/Requestable';

/**
 * User Auth Service API
 */
export default class UserAuthService extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Returns a single preference and value for this XNAT application.
   * @param {string} username - username
   * @param {string} password - password
   * @param {string} [provider=undefined] - provider
   * @param {function} [cb] - Callback function
   */
  authenticate(username, password, provider = undefined, cb = undefined) {
    return this._request('PUT', `/data/services/auth`, undefined, cb);
  }
}
