import UserMgmt from './UserMgmt';
import UserResource from './UserResource';
import ProjectUserAccess from './ProjectUserAccess';
import ProjectAccessRequest from './ProjectAccessRequest';

class UserAdmin {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  getDicomScpApi() {
    return new UserMgmt(this.jsXnat);
  }

  getAnonymizationApi() {
    return new UserResource(this.jsXnat);
  }

  getDicomScpApi() {
    return new ProjectUserAccess(this.jsXnat);
  }

  getAnonymizationApi() {
    return new ProjectAccessRequest(this.jsXnat);
  }
}

export default UserAdmin;
