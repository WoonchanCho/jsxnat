import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:UserAuthService`);

/**
 * User Auth Service API
 */
class UserAuthService extends Requestable {
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

export default UserAuthService;
