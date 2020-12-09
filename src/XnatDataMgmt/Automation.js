import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import { IllegalArgumentsError } from '../Error';

const log = debug(`${APP_NAME}:Automation`);

/**
 * Automation related API
 */
class Automation extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Returns the full map of automation settings for this XNAT application.
   * @param {function} cb optional callback function
   * @returns a object (map) of automation settings
   */
  getAutomationProperties(cb = undefined) {
    return this._request('GET', `/xapi/automation`, undefined, cb);
  }

  /**
   * Sets a map of automation properties.
   * @param {string} json automation properties to set
   * @param {function} cb optional callback function
   * @returns none
   */
  setAutomationProperties(json, cb = undefined) {
    return this._request('POST', `/xapi/automation`, json, cb);
  }

  /**
   * Returns whether internal scripting is enabled for this XNAT application.
   * @param {function} cb optional callback function
   * @returns a object (map) of automation settings
   */
  isAutomationEnabled(cb = undefined) {
    return this._request('GET', `/xapi/automation/enabled`, undefined, cb);
  }

  /**
   * Sets the internal scripting enabled flag for this XNAT application to the submitted value.
   * @param {bolean} enabled whether to enable scripting
   * @param {function} cb optional callback function
   * @returns {boolean} enabled
   */
  enableDisableAutomation(enabled, cb = undefined) {
    return this._request(
      'PUT',
      `/xapi/automation/enabled/${enabled}`,
      undefined,
      cb
    );
  }

  /**
   * Get list of event classes.
   * @param {function} cb optional callback function
   * @returns a object (map) of automation settings
   */
  getAllAutomationEventClasses(cb = undefined) {
    return this._request(
      'GET',
      `/xapi/eventHandlers/automationEventClasses`,
      undefined,
      cb
    );
  }

  /**
   * Get list of event classes for a specific project
   * @param {string} projectId projectId
   * @param {function} cb optional callback function
   * @returns a object (map) of automation settings
   */
  getAutomationEventClasses(projectId, cb = undefined) {
    return this._request(
      'GET',
      `/xapi/projects/${projectId}/eventHandlers/automationEventClasses`,
      undefined,
      cb
    );
  }
}

export default Automation;
