import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:UserMgmt`);

/**
 * XNAT User API
 * The User Management API provides the ability to manage user accounts, access, and permissions.
 */
class UserMgmt extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }
}

export default UserMgmt;
