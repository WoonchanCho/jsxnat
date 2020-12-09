import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import { IllegalArgumentsError } from '../Error';
import Resource from './Resource';

const log = debug(`${APP_NAME}:Prearchive`);

/**
 * Prearchive related API
 */
class Prearchive extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Prearchive session object
   * @typedef {object} PrearchiveSession Prearchive session
   * @property {string} autoarchive
   * @property {string} folderName
   * @property {string} lastmod YYYY-MM-DD HH:mm:SS.sss
   * @property {string} name
   * @property {string(boolean)} prevent_anon
   * @property {string(boolean)} prevent_auto_commit
   * @property {string} project
   * @property {string} PROTOCOL
   * @property {date} scan_date
   * @property {time} scan_time
   * @property {string} SOURCE 'SessionImporter'
   * @property {string} status
   * @property {string} subject
   * @property {string} tag
   * @property {string} timestamp 'YYYYMMDD_HHmmSSsss'
   * @property {string} TIMEZONE": "",
   * @property {datetime} uploaded
   * @property {string} url
  /**
   * 
   * 
   * Get A List Of All Sessions In The Prearchive
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns {ResultSet.Result.PrearchiveSession[]}
   */
  getAllSessions(format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/prearchive/projects`,
      {
        format,
      },
      cb
    );
  }

  /**
   * Get A List Of All Sessions In The Prearchive for a specific project
   * @param {string} projectId project id
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns {ResultSet.Result.PrearchiveSession[]}
   */
  getSessionsForProject(
    projectId,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/prearchive/projects/${projectId}`,
      {
        format,
      },
      cb
    );
  }

  /**
   * Move A Session To A New Project
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} projectId The ID of the destination project
   * @param {string | array} async Optional. Default is "false"
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns {ResultSet.Result.PrearchiveSession[]}
   */
  moveSessionToProject(
    src,
    projectId,
    async = false,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'POST',
      `/data/services/prearchive/move?${queryString.stringify({
        format,
      })}`,
      { src, newProject: projectId, async },
      cb,
      CONTENT_TYPES.form
    );
  }

  /**
   * Rebuild An Image Session Listing
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * @returns {ResultSet.Result.PrearchiveSession[]}
   */
  rebuildSession(src, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'POST',
      `/data/services/prearchive/rebuild?${queryString.stringify({
        format,
      })}`,
      { src },
      cb,
      CONTENT_TYPES.form
    );
  }

  /**
   * Delete An Image Session From The Prearchive
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * @returns {ResultSet.Result.PrearchiveSession[]}
   */
  deleteSession(src, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'POST',
      `/data/services/prearchive/delete`,
      { src },
      cb,
      CONTENT_TYPES.form
    );
  }

  static OverwriteOptions = {
    none: 'none',
    append: 'append',
    delete: 'delete',
  };

  /**
   * Archive An Image Session That Is Currently In The Prearchive
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {OverwriteOptions.values} overwrite Optional.
   * @param {boolean} quarantine Optional. none (default): Do not overwrite existing xml or files, append: Add content to existing xml & file system, but do not overwrite existing files, delete: Upload new data, and overwrite any existing files
   * @param {boolean} triggerPipelines Optional. false (default): follow project settings for whether new/modified archive content should go into quarantine, true: override project settings and place new/modified archive content in quarantine
   * @param {string} dest Optional. true (default): run the AutoRun pipeline for any archived sessions which are modified/created by this import, false: Do not run the AutoRun at this time
   * @param {function} cb optional callback function
   * @returns {ResultSet.Result.PrearchiveSession[]}
   */
  archive(
    src,
    overwrite = Prearchive.OverwriteOptions.none,
    quarantine = false,
    triggerPipelines = true,
    dest = '',
    cb = undefined
  ) {
    return this._request(
      'POST',
      `/data/services/archive`,
      { src, overwrite, quarantine, triggerPipelines, dest },
      cb,
      CONTENT_TYPES.form
    );
  }

  /**
   * Validate An Archive Operation

   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * @returns {ResultSet.Result.PrearchiveSession[]}
   */
  validateArchive(src, format, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'POST',
      `/data/services/validate-archive?${queryString.stringify({ format })}`,
      { src },
      cb,
      CONTENT_TYPES.form
    );
  }

  /**
   * Prearchive scan
   * @typedef {object} PrearchiveScan prearchive scan object
   * @property {string} ID scan id
   * @property {string} xsiType xsiType e.g. xnat:srScanData
   * @param {string} series_description series description
   */

  /**
   * Get A List Of Scans From A Session In The Prearchive
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * @param {Result.Prearchive[]}
   */
  getScans(src, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data${src}/scans`,
      { format },
      cb,
      CONTENT_TYPES.json
    );
  }

  /**
   * Delete A Single Scan From A Session In The Prearchive
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} scanId scan id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   * return none
   */
  deleteScan(src, scanId, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'DELETE',
      `/data${src}/scans/${scanId}`,
      { format },
      cb,
      CONTENT_TYPES.json
    );
  }

  /**
   * Get A List Of Scan Resources From A Session In The Prearchive
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} scanId scan id
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFolders(
    src,
    scanId,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return Resource.createResource(this).getFolders(
      `/data${src}/scans/${scanId}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Scan Resource File From A Session In The Prearchive
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} scanId scan id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFiles(
    src,
    scanId,
    resourceIdOrLabel,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return Resource.createResource(this).getFiles(
      `/data${src}/scans/${scanId}/resources/${resourceIdOrLabel}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Scan Resource File From A Session In The Prearchive
   * @param {string} src The location of the session relative to the prearchive path. Refer to the url property of PrearchiveSession object (e.g. /prearchive/projects/Sample_Project/20140411_140005287/Sample_Session)
   * @param {string} scanId scan id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   */
  getFile(src, scanId, resourceIdOrLabel, filename, cb = undefined) {
    return Resource.createResource(this).getFile(
      `/data${src}/scans/${scanId}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }

  /**
   * Returns a project's prearchive setting
   * @param {string} projectId project id
   * @param {function} cb optional callback function
   * @returns {0 | 4 | 5} "0": All uploaded image data will be placed into the prearchive. Users will have to manually transfer sessions into the permanent archive, "4": All uploaded image data will be auto-archived. If a session with the same label already exists, new files will NOT overwrite old ones, "5": All uploaded image data will be auto-archived. If a session with the same label already exists, new files WILL overwrite old ones
   */
  getPrearchiveSetting(projectId, cb = undefined) {
    return this._request(
      'GET',
      `/data/projects/${projectId}/prearchive_code`,
      undefined,
      cb
    );
  }

  /**
   * Set a project's prearhive setting
   * @param {string} projectId project id
   * @param {integer} code Valid Prearchive setting codes 0: Project is using the Prearchive, 4: Project is not using the Prearchive; No overwrites allowed, 5: Project is not using the Prearchive; No overwrites allowed
   * @param {function} cb optional callback function
   */
  setPrearchiveSetting(projectId, code, cb = undefined) {
    if (!this.__isOneOf(code, ProjectCommon.PreArchiveCodes)) {
      throw new IllegalArgumentsError(`code is not valid: ${code}`);
    }
    return this._request(
      'PUT',
      `/data/projects/${projectId}/prearchive_code/${code}`,
      undefined,
      cb
    );
  }
}

export default Prearchive;
