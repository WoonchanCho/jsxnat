import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import XmlParser from '../Common/XmlParser';
import { IllegalArgumentsError } from '../Error';
import Resource from './Resource';

const log = debug(`${APP_NAME}:Project`);

/**
 * Project related API
 */
class Project extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Valid Prearchive setting codes
   */
  static PreArchiveCodes = {
    Prearchive: 0,
    NoPrearchiveNoOverwrite: 4,
    NoPreachive: 5,
  };

  /**
   * Valid Quarantine setting codes
   */
  static QurantineCodes = {
    NoQuarantine: 0,
    UseQuarantine: 4,
  };

  /**
   * Get a listing of all projects
   * @param {boolean} options.accessible Optional. Restrict the list of projects to those that are accessible to the currently logged in user. This is a catchall for any project group that the user may be assigned to. Default is false.
   * @param {boolean} options.owner Optional. Restrict the list of projects to those where the currently logged in user is listed as an owner. Default is false.
   * @param {boolean} options.member Optional. Restrict the list of projects to those where the currently logged in user is listed as a member. Default is false.
   * @param {boolean} options.collaborator Optional. Restrict the list of projects to those where the currently logged in user is listed as a collaborator. Default is false.
   * @param {date} options.activeSince Optional. Restrict the list of projects to those who have been updated since the specified date. Date format is YYYY-MM-DD
   * @param {boolean} options.recent Optional. Restrict the list of projects to those who have been recently accessed by the logged in user. Default is false
   * @param {boolean} options.favorite Optional. Restrict the list of projects to those in the current user's "favorites" list.
   * @param {string} [format='json'] Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getProjects(options, format = RESPONSE_FORMAT.json, cb = undefined) {
    return this._request('GET', '/data/projects', { ...options, format }, cb);
  }

  /**
   * Get a single project
   * @param {string} id project id (value of xnat:projectData/ID)
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getProject(id, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request('GET', `/data/projects/${id}`, { format }, cb);
  }

  /**
   * Create a simple project
   * @param {string} id project id
   * @param {string} secondaryId Optional. project secondary id. id will be used if empty
   * @param {string} name Optional. project name. id will be used if empty
   * @param {function} cb optional callback function
   * @returns {string} full project uri
   */
  createSimpleProject(
    id,
    secondaryId = undefined,
    name = undefined,
    cb = undefined
  ) {
    return this.createProject(
      {
        _attrs: {
          ID: id,
          secondary_ID: secondaryId ? secondaryId : id,
        },
        name: name ? name : id,
      },
      cb
    );
  }

  /**
   * Create a project
   * @param {object} json object type project data
   * @param {function} cb optional callback function
   */
  createProject(json, cb = undefined) {
    if (!json) {
      throw new IllegalArgumentsError(`project data is required`);
    }
    const {
      _attrs: { ID, secondary_ID },
      name,
    } = json;
    if (!ID) {
      throw new IllegalArgumentsError(`ID is required`);
    }
    if (!secondary_ID) {
      throw new IllegalArgumentsError(`secondary_ID is required`);
    }
    if (!name) {
      throw new IllegalArgumentsError(`name is required`);
    }

    return this.createProjectWithRawXml(
      new XmlParser().convertFromJsonToXml('Project', json),
      cb
    );
  }

  /**
   * Create a project represented by XML
   * @param {string} xml project xml representation
   * @param {string} name project name
   * @param {function} cb optional callback function
   */
  createProjectWithRawXml(xml, cb = undefined) {
    return this._request('POST', '/data/projects', xml, cb, CONTENT_TYPES.xml);
  }

  /**
   * Update a project
   * @param {string} id project id
   * @param {object} json object type project data
   * @param {function} cb optional callback function
   */
  updateProject(id, json, cb = undefined) {
    if (!json) {
      throw new IllegalArgumentsError(`project data is required`);
    }

    return this.updateProjectWithRawXml(
      id,
      new XmlParser().convertFromJsonToXml('Project', json),
      cb
    );
  }

  /**
   * Update a project represented by XML
   * @param {string} id project id
   * @param {string} xml project xml representation
   * @param {function} cb optional callback function
   */
  updateProjectWithRawXml(id, xml, cb = undefined) {
    return this._request(
      'PUT',
      `/data/projects/${id}`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Delete a project with the project id provided
   * @param {string} id project id
   * @param {function} cb optional callback function
   */
  deleteProject(id, cb = undefined) {
    return this._request('DELETE', `/data/projects/${id}`, undefined, cb);
  }

  /**
   * Returns the accessibility status as a string: 'Public', 'Protected' or 'Private'
   * @param {string} id project id
   * @param {function} cb optional callback function
   */
  getProjectAccessibility(id, cb = undefined) {
    return this._request(
      'GET',
      `/data/projects/${id}/accessibility`,
      undefined,
      cb
    );
  }

  /**
   * Set a accessibility status
   * @param {string} id project id
   * @param {string} status accessibility status 'Public', 'Protected' or 'Private'
   * @param {function} cb optional callback function
   */
  setProjectAccessibility(id, status, cb = undefined) {
    if (!status) {
      throw new IllegalArgumentsError(`status is required`);
    }
    return this._request(
      'PUT',
      `/data/projects/${id}/accessibility/${status.toLowerCase()}`,
      undefined,
      cb
    );
  }

  /**
   * Returns a project's prearchive setting
   * @param {string} id project id
   * @param {function} cb optional callback function
   * @returns {0 | 4 | 5} "0": All uploaded image data will be placed into the prearchive. Users will have to manually transfer sessions into the permanent archive, "4": All uploaded image data will be auto-archived. If a session with the same label already exists, new files will NOT overwrite old ones, "5": All uploaded image data will be auto-archived. If a session with the same label already exists, new files WILL overwrite old ones
   */
  getPrearchiveSetting(id, cb = undefined) {
    return this._request(
      'GET',
      `/data/projects/${id}/prearchive_code`,
      undefined,
      cb
    );
  }

  /**
   * Set a project's prearhive setting
   * @param {string} id project id
   * @param {integer} code Valid Prearchive setting codes 0: Project is using the Prearchive, 4: Project is not using the Prearchive; No overwrites allowed, 5: Project is not using the Prearchive; No overwrites allowed
   * @param {function} cb optional callback function
   */
  setPrearchiveSetting(id, code, cb = undefined) {
    if (!this.__isOneOf(code, ProjectCommon.PreArchiveCodes)) {
      throw new IllegalArgumentsError(`code is not valid: ${code}`);
    }
    return this._request(
      'PUT',
      `/data/projects/${id}/prearchive_code/${code}`,
      undefined,
      cb
    );
  }

  /**
   * Returns a project's quarantine code
   * @param {string} id project id
   * @param {function} cb optional callback function
   */
  getQurantineCode(id, cb = undefined) {
    return this._request(
      'GET',
      `/data/projects/${id}/quarantine_code`,
      undefined,
      cb
    );
  }

  /**
   * Set a project's quarantine code
   * @param {string} id project id
   * @param {integer} code Valid Quarantine setting codes 0: Project is not using the Quarantine, 4: Project is using the Quarantine
   * @param {function} cb optional callback function
   */
  setQurantineCode(id, code, cb = undefined) {
    if (!this.__isOneOf(code, ProjectCommon.QurantineCodes)) {
      throw new IllegalArgumentsError(`code is not valid: ${code}`);
    }
    return this._request(
      'PUT',
      `/data/projects/${id}/quarantine_code/${code}`,
      undefined,
      cb
    );
  }

  /**
   * Returns project's scan types
   * @param {string} id project id
   * @param {function} cb optional callback function
   */
  getScanTypes(id, dataType, cb = undefined) {
    return this._request(
      'GET',
      `/data/projects/${id}/scan_types`,
      dataType ? { table: dataType } : undefined,
      cb
    );
  }

  /**
   * returns a list of all investigators configured in the XNAT system.
   * @param {function} cb optional callback function
   */
  getAllInvestigators(cb = undefined) {
    return this._request('GET', '/xapi/investigators', undefined, cb);
  }

  /**
   * Returns the investigator with the specified ID.
   * @param {string} id investigator id
   * @param {function} cb optional callback function
   */
  getInvestigator(id, cb = undefined) {
    return this._request('GET', `/xapi/investigators/${id}`, undefined, cb);
  }

  /**
   * Investigator type
   * @typedef {object} Investigator
   * @property {string} id - investigator id
   * @property {string} type - fixed with Investigator
   * @property {string} firstname - First Name
   * @property {string} lastname - Lat Name
   * @property {string} institution - institution name
   * @property {string} department - department name
   * @property {string} email - valid email address
   * @property {string} phone - valid phone number
   * @property {string} title - title
   * @property {string} primaryProjects - an array of primiary projects
   * @property {array} investigatorProjects - an array of investigator projects
   */

  /**
   * Returns the newly created investigator with the submitted attributes.
   * @param {Investigator} investigator investigator object
   * @param {function} cb optional callback function
   */
  createInvestigator(investigator, cb = undefined) {
    investigator.type = 'Investigator';
    return this._request('POST', `/xapi/investigators`, investigator, cb);
  }

  /**
   * Updates the requested investigator from the submitted attributes and returns the updated investigator.
   * @param {Investigator} id investigator id
   * @param {Investigator} investigator investigator object
   * @param {function} cb optional callback function
   * @returns {Investigator} the updated investigator.
   */
  updateInvestigator(id, investigator, cb = undefined) {
    investigator.type = 'Investigator';
    return this._request('PUT', `/xapi/investigators/${id}`, investigator, cb);
  }

  /**
   * Deletes the requested investigator.
   * @param {string} id investigator id
   * @param {function} cb optional callback function
   * @returns Returns true if the requested investigator was successfully deleted. Returns false otherwise.
   */
  deleteInvestigator(id, cb = undefined) {
    return this._request('DELETE', `/xapi/investigators/${id}`, undefined, cb);
  }

  /**
   * Get A List Of Users Associated With A Project
   * @param {string} id project id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * @returns associated user lists. format will be determined by the requested format value.
   */
  getAssociatedUsers(id, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request('GET', `/data/projects/${id}/users`, { format }, cb);
  }

  /**
   * Add Project Access To A User Account
   * @param {string} id project id
   * @param {string} groupName the display name of the access group you want the new user to join (aka "Members"
   * @param {string} usernameOremail username of email address
   * @param {function} cb optional callback function
   * @returns an updated list of users
   */
  grantAccessToUser(id, groupName, usernameOremail, cb = undefined) {
    return this._request(
      'PUT',
      `/data/projects/${id}/users/${groupName}/${usernameOremail}`,
      undefined,
      cb
    );
  }

  /**
   * Remove Project Access From A User Account
   * @param {string} id project id
   * @param {string} groupName the display name of the access group you want the new user to join (aka "Members"
   * @param {string} usernameOremail username of email address
   * @param {function} cb optional callback function
   * @returns an updated list of users
   */
  removeAccessFromUser(id, groupName, usernameOremail, cb = undefined) {
    return this._request(
      'DELETE',
      `/data/projects/${id}/users/${groupName}/${usernameOremail}`,
      undefined,
      cb
    );
  }

  /**
   * List All Project Access Requests For A Project
   * @param {string} id project id
   * @param {function} cb optional callback function
   * @returns array of ppending project access requests for the specified project
   */
  getProjectAccessRequestforProject(
    id,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request('GET', `/data/projects/${id}/pars`, { format }, cb);
  }

  /**
   * Get All Site-wide Project Access Requests For The current User
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * @returns array of pending project access requests for the current user. the "firstname", "lastname", and "login" fields refer to the user who created the invitation. "level" refers to the project access group. "?column?" is used for the project investigator field.
   */
  getProjectAccessRequests(format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request('GET', `/data/pars`, { format }, cb);
  }

  static ProjectAccessRequestActions = {
    accept: 'accept',
    decline: 'decline',
  };

  /**
   * Accept Or Decline Project Access Request
   * @param {string} id project id
   * @param {string} action accept or decline
   * @param {function} cb optional callback function
   */
  acceptOrDeclineProjectAccessRequest(id, action, cb = undefined) {
    if (!ProjectCommon.ProjectAccessRequestActions[action]) {
      throw new IllegalArgumentsError(`action is invalid: ${action}`);
    }
    return this._request(
      'PUT',
      `/data/pars/${id}?${action}=true`,
      undefined,
      cb
    );
  }

  /**
   * Get A Listing Of Tools With Active Configurations At The Project Level
   * @param {string} id project id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * @returns array of pending project access requests for the current user. the "firstname", "lastname", and "login" fields refer to the user who created the invitation. "level" refers to the project access group. "?column?" is used for the project investigator field.
   */
  getTools(id, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request('GET', `/data/projects/${id}/config`, { format }, cb);
  }

  /**
   * Tool Config Object type
   * @typedef {object} ToolConfigObject
   * @property {string} contents - The actual contents of the configuration file
   * @property {datetime} create_date - The date/time the configuration was created
   * @property {string} path - the path to the configuration file
   * @property {string} reason - The user provided reason for uploading the configuration
   * @property {string} project - project id
   * @property {string} status - Enumerated setting: "enabled" / "disabled"
   * @property {string} tool - The name of a tool that has configuration files
   * @property {boolean} unversioned - Whether or not this config object is "versioned."
   * @property {string} user - The user who created the configuration
   * @property {integer} version version	version number of the configuration contents
   */

  /**
   * Get A Config Object For A Specific Tool In Your Project
   * @param {string} id project id
   * @param {string} toolId tool id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {boolean} acceptNotFound Optional. returns a 204 - Content Not Found code, if no configs have been set for this tool when true. false by default
   * @param {function} cb optional callback function
   * @returns {ToolConfigObject}
   */
  getConfigObjectForTool(
    id,
    toolId,
    format = RESPONSE_FORMAT.json,
    acceptNotFound = false,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/projects/${id}/config/${toolId}`,
      { format, 'accept-not-found': acceptNotFound },
      cb
    );
  }

  /**
   * Store A Project-specific Config Value For A Specific Tool
   * @param {string} id project id
   * @param {string} toolId tool id
   * @param {string} filePath file path
   * @param {string} contents contents. The format of your config value should match the format expected by the tool. If you are not sure what that is, perform a GET to get the current value.
   * @param {function} cb optional callback function
   * @returns {undefined} No response object is returned. A "201" response code indicates that the config value was stored.
   */
  storeConfigForTool(id, toolId, filePath, contents, cb = undefined) {
    return this._request(
      'PUT',
      `/data/projects/${id}/config/${toolId}/${filePath}?inbody=true`,
      contents,
      cb
    );
  }

  /**
   * Get A Listing Of Pipelines In Your Project
   * @param {string} id project id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getPipelines(id, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/projects/${id}/pipelines`,
      { format },
      cb
    );
  }

  /**
   * Get Details Of A Pipeline Execution Workflow Step
   * @param {string} projectId project id
   * @param {string} stepId Specify the ID of the pipeline step as defined in the Pipeline XML.
   * @param {string} experimentId Specify the Accession ID of the root experiment that the pipeline was launched on.
   * @param {function} cb optional callback function
   */
  getDetailOfPipelineExecutionStep(
    projectId,
    stepId,
    experimentId,
    cb = undefined
  ) {
    return this._request(
      'GET',
      `/data/projects/${projectId}/pipelines/${stepId}/experiments/${experimentId}`,
      undefined,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Folders Stored With A Project
   * @param {string} projectId project id
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFolders(
    projectId,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFolders(
      `/data/projects/${projectId}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Project
   * @param {string} projectId project id
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFiles(
    projectId,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFiles(
      `/data/projects/${projectId}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Project
   * @param {string} projectId project id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   */
  getFile(projectId, resourceIdOrLabel, filename, cb = undefined) {
    return Resource.createResource(this).getFile(
      `/data/projects/${projectId}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }

  /**
   * Create A New Project Resource Folder
   * @param {string} projectId project id
   * @param {string} resourceLabel resource label (folder name)
   * @param {string} format Optional. Specify a string format descriptor for this resource folder.
   * @param {string | array} tags Optional. Specify a comma-separated list of tags for this resource folder.
   * @param {string} contents Optional. Specify a string description of the resource folder's content.
   * @param {function} cb optional callback function
   * @returns none
   */
  createFolder(
    projectId,
    resourceLabel,
    format = undefined,
    tags = [],
    content = undefined,
    cb = undefined
  ) {
    return Resource.createResource(this).createFolder(
      `/data/projects/${projectId}`,
      resourceLabel,
      format,
      tags,
      content,
      cb
    );
  }

  /**
   * Upload A New Project Resource File
   * @param {string} projectId project id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {Buffer} file file buffer (need to check if this is compatilable from browser)
   * @param {boolean} overwrite Optional. overwrite the file if the file that has the same filename already exists in the same location
   * @param {function} cb optional callback function
   * @returns none
   */
  uploadFile(
    projectId,
    resourceIdOrLabel,
    filename,
    file,
    overwrite = false,
    cb = undefined
  ) {
    return Resource.createResource(this).uploadFile(
      `/data/projects/${projectId}`,
      resourceIdOrLabel,
      filename,
      file,
      overwrite,
      cb
    );
  }

  /**
   * Delete A Project Resource Folder
   * @param {string} projectId project id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {boolean} safe Optional. if throw errors if files exists in the resource folder
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteFolder(projectId, resourceIdOrLabel, safe = false, cb = undefined) {
    return Resource.createResource(this).deleteFolder(
      `/data/projects/${projectId}`,
      resourceIdOrLabel,
      safe,
      cb
    );
  }

  /**
   * Delete A Project Resource File
   * @param {string} projectId project id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   * @returns none
   */

  deleteFile(projectId, resourceIdOrLabel, filename, cb = undefined) {
    return Resource.createResource(this).deleteFile(
      `/data/projects/${projectId}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }

  /**
   * Check if the code exists in the property of the object.
   * @param {string} code
   * @param {obj} obj
   * @returns {boolean} returns true if the code exists in the property of the object.
   */
  __isOneOf(code, obj) {
    return Object.values(obj).find((c) => c == parseInt(code)) !== undefined;
  }
}

export default Project;
