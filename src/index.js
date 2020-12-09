import debug from 'debug';
import { Base64 } from 'js-base64';
import { APP_NAME, AUTH_METHODS } from './Common/Constant';
import { cleanseUrl } from './Common/Util';
import SiteAdmin from './XnatAdmin/SiteAdmin';
import SystemAdmin from './XnatAdmin/SystemAdmin';
import UserAdmin from './XnatAdmin/UserAdmin';
import UserAuth from './XnatAdmin/UserAuth';
import PluginAdmin from './XnatAdmin/PluginAdmin';
import UiConfig from './XnatAdmin/UiConfig';
import DicomConfig from './XnatAdmin/DicomConfig';
import OtherService from './XnatAdmin/OtherService';
import Project from './XnatDataMgmt/Project';
import Subject from './XnatDataMgmt/Subject';
import Experiment from './XnatDataMgmt/Experiment';
import Scan from './XnatDataMgmt/Scan';
import ImageAssessor from './XnatDataMgmt/ImageAssessor';
import Resource from './XnatDataMgmt/Resource';
import Archive from './XnatDataMgmt/Archive';
import Search from './XnatDataMgmt/Search';
import DataProcessing from './XnatDataMgmt/DataProcessing';
import Automation from './XnatDataMgmt/Automation';
import Prearchive from './XnatDataMgmt/Prearchive';
import DicomDump from './XnatDataMgmt/DicomDump';
import Workflow from './XnatDataMgmt/Workflow';

const log = debug(`${APP_NAME}:JsXnat`);

/**
 * Auth
 * @typedef {Object} Auth
 * @property {} authMethod -
 * @property {string} [username] - Valid XNAT username
 * @property {string} [password] - Valid XNAT password
 * @property {UserAliasTokenObject} [token] - token object
 */
class Auth {
  constructor(username, password, authMethod = AUTH_METHODS.token) {
    this.username = username;
    this.password = password;
    this.authMethod =
      authMethod === AUTH_METHODS.password ? authMethod : AUTH_METHODS.token;
  }
}

/**
 * JsXnat encapsulates the functionality to create various API wrapper objects.
 */
export default class JsXnat {
  /**
   * Intialize the basic paramemters for accessing an XNAT node
   * @param {string} basePath - the XNAT base URL e.g. https://mirrir.wustl.edu
   * @param {string} username - Valid XNAT username
   * @param {string} password - Valid XNAT password
   * @param {string} [authMethod='token'] Auth Method: either password or token
   */
  constructor(basePath, username, password, authMethod = AUTH_METHODS.token) {
    this.basePath = cleanseUrl(basePath);
    this.auth = new Auth(username, password, authMethod);
  }

  async refreshToken() {
    const userAuth = this.getUserAuth();
    const userAliasTokenApi = userAuth.getUserAliasTokenApi();
    this.auth.token = await userAliasTokenApi.issueToken();
  }

  async invalidateToken() {
    if (!this.auth.token) {
      return;
    }
    const credential = await this.__getCredential();
    const userAuth = this.getUserAuth();
    const userAliasTokenApi = userAuth.getUserAliasTokenApi();
    await userAliasTokenApi.invalidateToken(credential[0], credential[1]);
    this.auth.token = undefined;
  }

  async __validateAuth() {}

  async __getCredential(requiredAuthMethod) {
    const { authMethod, username, password, token } = this.auth;
    if (
      requiredAuthMethod === AUTH_METHODS.password ||
      authMethod === AUTH_METHODS.password
    ) {
      return [username, password];
    }

    let shouldBeRefreshed = true;
    if (token) {
      const { enabled, estimatedExpirationTime } = token;
      if (enabled && estimatedExpirationTime > Date.now()) {
        shouldBeRefreshed = false;
      }
    }

    if (shouldBeRefreshed) {
      await this.refreshToken();
    }
    return [this.auth.token.alias, this.auth.token.secret];
  }

  /**
   * Get the authorization header to be included in the HTTP request header. In most cases, you don't need to call this function directly.
   * @returns {string} authorizatio header
   */
  async getAuthorizationHeader(requiredAuthMethod = undefined) {
    const credential = await this.__getCredential(requiredAuthMethod);
    return 'Basic ' + Base64.encode(credential[0] + ':' + credential[1]);
  }

  /**
   * Get the XNAT's version info that the currrent JsXnat object points to
   * @param {boolean} [includesBuildNumber=false] - true if you want a build number along with version number
   * @returns {string} Version info
   */
  async getVersion(includesBuildNumber = false) {
    const buildInfo = await this.getSiteAdmin()
      .getSiteConfigApi()
      .getBuildInfo();
    let version = `version ${buildInfo.version}`;
    if (includesBuildNumber) {
      version += `, build: ${buildInfo.buildNumber}`;
    }
    return version;
  }

  /**
   * Get the Site Administration group class
   * @returns {SiteAdmin} a Class grouping the API wrappers related to Site-Administration jobs
   */
  getSiteAdmin() {
    return new SiteAdmin(this);
  }

  /**
   * Get the System Administration group class
   * @returns {SystemAdmin} a Class grouping the API wrappers related to System-Administration jobs
   */
  getSystemAdmin() {
    return new SystemAdmin(this);
  }

  /**
   * Get the User Administration group class
   * @returns {UserAdmin} a Class grouping the API wrappers related to User-Administration jobs
   */
  getUserAdmin() {
    return new UserAdmin(this);
  }

  /**
   * Get the User Authentication group class
   * @returns {UserAuth} a Class grouping the API wrappers related to User-Authentication jobs
   */
  getUserAuth() {
    return new UserAuth(this);
  }

  /**
   * Get the Plugin Administration group class
   * @returns {PluginAdmin} a Class grouping the API wrappers related to Plugin-Administration jobs
   */
  getPluginAdmin() {
    return new PluginAdmin(this);
  }

  /**
   * Get the UI Configuration group class
   * @returns {UserAdmin} a Class grouping the API wrappers related to UI-Configuration jobs
   */
  getUiConfig() {
    return new UiConfig(this);
  }

  /**
   * Get the Dicom group class
   * @returns {Dicom} a Class grouping the API wrappers related to DICOM jobs
   */
  getDicomConfig() {
    return new DicomConfig(this);
  }

  /**
   * Get the Other group class
   * @returns {Other} a Class grouping the API wrappers related to miscellaneous jobs
   */
  getOtherService() {
    return new OtherService(this);
  }

  /**
   * Get the Project API wrapper class
   * @returns {Project} the Project API wrapper class
   */
  getProjectApi() {
    return new Project(this);
  }

  /**
   * Get the Subject API wrapper class
   * @returns {Subject} the Subject API wrapper class
   */
  getSubjectApi() {
    return new Subject(this);
  }

  /**
   * Get the Experiment API wrapper class
   * @returns {Experiment} the Experiment API wrapper class
   */
  getExperimentApi() {
    return new Experiment(this);
  }

  /**
   * Get the Scan API wrapper class
   * @returns {Scan} the Scan API wrapper class
   */
  getScanApi() {
    return new Scan(this);
  }

  /**
   * Get the Image Assessor API wrapper class
   * @returns {ImageAssessor} the Image Assessor API wrapper class
   */
  getImageAssessorApi() {
    return new ImageAssessor(this);
  }

  /**
   * Get the Resource API wrapper class
   * @returns {Resource} the Resource API wrapper class
   */
  getResouceApi() {
    return new Resource(this);
  }

  /**
   * Get the Project API wrapper class
   * @returns {Archive} the Archive API wrapper class
   */
  getArchiveApi() {
    return new Archive(this);
  }

  /**
   * Get the Prearchive API wrapper class
   * @returns {Prearchive} the Prearchive API wrapper class
   */
  getPrearchiveApi() {
    return new Prearchive(this);
  }

  /**
   * Get the Search API wrapper class
   * @returns {Search} the Search API wrapper class
   */
  getSearchApi() {
    return new Search(this);
  }

  /**
   * Get the Data Processing API wrapper class
   * @returns {DataProcessing} the Data Processing API wrapper class
   */
  getDataProcessingApi() {
    return new DataProcessing(this);
  }

  /**
   * Get the Automation API wrapper class
   * @returns {Automation} the Automation API wrapper class
   */
  getAutomationApi() {
    return new Automation(this);
  }

  /**
   * Get the Dicom Dump API wrapper class
   * @returns {DicomDump} the Dicom Dump API wrapper class
   */
  getDicomDumpApi() {
    return new DicomDump(this);
  }

  /**
   * Get the Workflow API wrapper class
   * @returns {DicomDump} the Dicom Dump API wrapper class
   */
  getWorkflowApi() {
    return new Workflow(this);
  }
}
