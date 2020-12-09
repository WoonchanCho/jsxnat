import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, AUTH_METHODS } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:UserAliasToken`);

/**
 * Wrapper class for the User Alias related APIs
 */
class UserAliasToken extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * User Alias Token Object
   * @typedef UserAliasTokenObject
   * @property {string} alias
   * @property {string} xdatUserId
   * @property {string} secret
   * @property {boolean} singleUse
   * @property {integer} estimatedExpirationTime
   * @property {integer} timestamp
   * @property {boolean} enabled
   * @property {integer} created
   * @property {string} id
   * @property {integer} disabled
   */

  /**
   * Issue A New User Alias Token
   * @param {function} [cb] Callback function
   * @return {UserAliasTokenObject} User Alias Token Object
   */
  async issueToken(cb = undefined) {
    const res = await this._request(
      'GET',
      `/data/services/tokens/issue`,
      undefined,
      cb,
      CONTENT_TYPES.json,
      AUTH_METHODS.password
    );
    if (typeof res === 'object') {
      return res;
    } else {
      return JSON.parse(res);
    }
  }

  /**
   * Issue A New User Alias Token For Another User
   * @param {string} username username
   * @param {function} [cb] Callback function
   * @return {UserAliasTokenObject} User Alias Token Object
   */
  issueTokenForUser(username, cb = undefined) {
    if (!username) {
      throw new IllegalArgumentsError('username is required');
    }

    return this._request(
      'GET',
      `/data/services/tokens/issue/user/${username}`,
      undefined,
      cb
    );
  }

  /**
   * Validate A User Alias Token
   * @param {string} token token
   * @param {string} secret secret
   * @param {function} [cb] Callback function
   * @return {object}
   */
  validateToken(token, secret, cb = undefined) {
    if (!token) {
      throw new IllegalArgumentsError('token is required');
    }
    if (!secret) {
      throw new IllegalArgumentsError('secret is required');
    }
    return this._request(
      'GET',
      `/data/services/tokens/validate/${token}/${secret}`,
      undefined,
      cb
    );
  }

  /**
   * Invalidate A User Alias Token
   * @param {string} token token
   * @param {string} secret secret
   * @param {function} [cb] Callback function
   * @return none
   */
  invalidateToken(token, secret, cb = undefined) {
    if (!token) {
      throw new IllegalArgumentsError('token is required');
    }
    if (!secret) {
      throw new IllegalArgumentsError('secret is required');
    }
    return this._request(
      'GET',
      `/data/services/tokens/invalidate/${token}/${secret}`,
      undefined,
      cb
    );
  }
}

export default UserAliasToken;
