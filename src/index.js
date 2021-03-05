import { Base64 } from 'js-base64';
import { AUTH_METHODS } from './Common/Constant';
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
import { IllegalArgumentsError } from './Error';

/**
 * Auth
 * @typedef {Object} Auth
 * @property {string} authMethod - Auth method: either password, token or noAuth
 * @property {string} [username] - Valid XNAT username
 * @property {string} [password] - Valid XNAT password
 */
class Auth {
  constructor(authMethod, username, password) {
    if (!AUTH_METHODS[authMethod]) {
      throw new IllegalArgumentsError(
        `the auth method provided is not valid: ${this.authMethod}`
      );
    }

    this.authMethod = authMethod;

    if (
      this.authMethod === AUTH_METHODS.password ||
      this.authMethod === AUTH_METHODS.token
    ) {
      if (!username) {
        throw new IllegalArgumentsError(
          `username is required when the auth method type is ${this.authMethod}`
        );
      }
      this.username = username;

      if (!password) {
        throw new IllegalArgumentsError(
          `password is required when the auth method type is ${this.authMethod}`
        );
      }
      this.password = password;
    }
  }
}

/**
 * JsXnat encapsulates the functionality to create various API wrapper objects.
 */
export default class JsXnat {
  /**
   * Intialize the basic paramemters for accessing an XNAT node
   * @param {string} [authMethod='noAuth'] - Auth method: either noAuth, token, or password (password is not preferred in most cases.)
   * @param {string} basePath - the XNAT base URL e.g. https://mirrir.wustl.edu
   * @param {Object} [options={}] - additional options depending on the auth method
   * @param {string} options.username - XNAT username. Required when authMethod is password or token
   * @param {string} options.password - XNAT password. Required when authMethod is password or token
   */
  constructor(authMethod = AUTH_METHODS.noAuth, basePath, options = {}) {
    this.auth = new Auth(authMethod, options.username, options.password);

    if (!basePath) {
      throw new IllegalArgumentsError(`the base path is required`);
    }
    this.basePath = cleanseUrl(basePath);
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
    if (this.authMethod === AUTH_METHODS.noAuth) {
      return undefined;
    }

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
    if (this.auth.authMethod === AUTH_METHODS.noAuth) {
      return '';
    }
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
   * @returns {UiConfig} a Class grouping the API wrappers related to UI-Configuration jobs
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
  getResourceApi() {
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
