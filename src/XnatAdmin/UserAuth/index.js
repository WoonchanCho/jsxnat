import UserSessionMgmt from './UserSessionMgmt';
import UserAuthService from './UserAuthService';
import UserAliasToken from './UserAliasToken';

export default class UserAuth {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  getUserSessionMgmtApi() {
    return new UserSessionMgmt(this.jsXnat);
  }

  getUserAuthServiceApi() {
    return new UserAuthService(this.jsXnat);
  }

  getUserAliasTokenApi() {
    return new UserAliasToken(this.jsXnat);
  }
}
