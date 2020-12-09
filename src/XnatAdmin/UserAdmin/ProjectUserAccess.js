import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:SiteAdmin`);

/**
 * Project User Access API
 */
class ProjectUserAccess extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Returns the full map of preferences and values for this XNAT application.
   * @param {string} returnFormat return format (either json or ini)
   * @param {function | undefined} cb optional callback function
   */
  getAllPreferences(returnFormat = 'json', cb = undefined) {
    if (returnFormat !== 'json' && returnFormat !== 'ini') {
      throw new IllegalArgumentsError(`Invalid format: ${returnFormat}`);
    }
    const path = '/xapi/prefs' + (returnFormat === 'json' ? '' : '/ini');
    return this._request('GET', path, undefined, cb);
  }

  /**
   * Returns preferences for matched tool id
   * @param {string} toolId toolId
   * @param {string} returnFormat return format (either json or ini)
   * @param {function | undefined} cb optional callback function
   */
  getPreferences(toolId, returnFormat = 'json', cb = undefined) {
    if (toolId === undefined) {
      throw new IllegalArgumentsError('toolId is required');
    }
    if (returnFormat !== 'json' && returnFormat !== 'ini') {
      throw new IllegalArgumentsError(`Invalid format: ${returnFormat}`);
    }
    const path =
      '/xapi/prefs' + (returnFormat === 'json' ? '/props/' : '/ini/') + toolId;
    return this._request('GET', path, undefined, cb);
  }

  /**
   * Returns a single preference and value for this XNAT application.
   * @param {string} toolId toolId
   * @param {string} preference a single preference
   * @param {function | undefined} cb optional callback function
   */
  getPreference(toolId, preference, cb = undefined) {
    if (toolId === undefined) {
      throw new IllegalArgumentsError('toolId is required');
    }
    if (preference === undefined) {
      throw new IllegalArgumentsError('preference is required');
    }
    return this._request(
      'GET',
      `/xapi/prefs/props/${toolId}/${preference}`,
      undefined,
      cb
    );
  }

  /**
   * Set a value for a single preference
   * @param {string} toolId toolId
   * @param {string} preference a single preference
   * @param {function | undefined} cb optional callback function
   */
  setPreference(toolId, preference, value, cb = undefined) {
    if (toolId === undefined) {
      throw new IllegalArgumentsError('toolId is required');
    }
    if (preference === undefined) {
      throw new IllegalArgumentsError('preference is required');
    }
    if (value === undefined) {
      throw new IllegalArgumentsError('value is required');
    }
    return this._request(
      'PUT',
      `/xapi/prefs/props/${toolId}/${preference}`,
      value,
      cb
    );
  }
}

export default ProjectUserAccess;
