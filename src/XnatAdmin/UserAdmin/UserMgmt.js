import Requestable from '../../Common/Requestable';

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
