import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:Anonymization`);

/**
 * the API Wrapper Class for the Anonymization APIs
 */
class Anonymization extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Gets the default anonymization script
   * @param {function} [cb] - Callback function
   * @returns {string} Anonymization script
   */
  getDefaultScript(cb = undefined) {
    return this._request('GET', `/xapi/anonymize/default`, undefined, cb);
  }

  /**
   * Gets the project-specific anonymization script.
   * @param {string} projectId - Project ID
   * @param {function} [cb] - Callback function
   * @returns {string} Anonymization script
   */
  getScript(projectId, cb = undefined) {
    if (!projectId) {
      throw new IllegalArgumentsError('project id is required');
    }
    return this._request(
      'GET',
      `/xapi/anonymize/projects/${projectId}`,
      undefined,
      cb
    );
  }

  /**
   * Sets the project-specific anonymization script.
   * @param {string} projectId - Project ID
   * @param {string} script - Anonymization script
   * @param {function} [cb] - Callback function
   */
  setScript(projectId, script, cb = undefined) {
    if (!projectId) {
      throw new IllegalArgumentsError('project id is required');
    }
    if (!script) {
      throw new IllegalArgumentsError('script is required');
    }
    return this._request(
      'PUT',
      `/xapi/anonymize/projects/${projectId}`,
      script,
      cb,
      CONTENT_TYPES.plain
    );
  }

  /**
   * Indicates whether the project-specific anonymization script is enabled or disabled.
   * @param {string} projectId - Project ID
   * @param {function} [cb] - Callback function
   * @returns {boolean} whether the anonymization script is enabled or disabled.
   */
  isScriptEnabled(projectId, cb = undefined) {
    if (!projectId) {
      throw new IllegalArgumentsError('project id is required');
    }
    return this._request(
      'GET',
      `/xapi/anonymize/projects/${projectId}/enabled`,
      undefined,
      cb
    );
  }

  /**
   * Enables or disables the project-specific anonymization script.
   * @param {string} projectId - Project ID
   * @param {boolean} [enable=true] - enable
   * @param {function} [cb] - Callback function
   * @returns none
   */
  enableDisableScript(projectId, enable = true, cb = undefined) {
    if (!projectId) {
      throw new IllegalArgumentsError('project id is required');
    }
    return this._request(
      'PUT',
      `/xapi/anonymize/projects/${projectId}/enabled?${queryString.stringify({
        enable,
      })}`,
      undefined,
      cb
    );
  }

  /**
   * Gets the site-wide anonymization script.
   * @param {function} [cb] - Callback function
   * @returns {string} Anonymization script
   */
  getSiteWideScript(cb = undefined) {
    return this._request('GET', `/xapi/anonymize/site`, undefined, cb);
  }

  /**
   * /xapi/anonymize/site
   * @param {string} script - Anonymization script
   * @param {function} [cb] - Callback function
   */
  setSiteWideScript(script, cb = undefined) {
    if (!script) {
      throw new IllegalArgumentsError('script is required');
    }
    return this._request(
      'PUT',
      `/xapi/anonymize/site`,
      script,
      cb,
      CONTENT_TYPES.plain
    );
  }

  /**
   * Indicates whether the site-wide anonymization script is enabled or disabled.
   * @param {string} projectId - Project ID
   * @param {function} [cb] - Callback function
   * @returns {boolean} whether the anonymization script is enabled or disabled.
   */
  isSiteWideScriptEnabled(cb = undefined) {
    return this._request('GET', `/xapi/anonymize/site/enabled`, undefined, cb);
  }

  /**
   * Enables or disables the site-wide anonymization script.
   * @param {boolean} [enable=true] - enable
   * @param {function} [cb] - Callback function
   * @returns none
   */
  enableDisableSiteWideScript(enable = true, cb = undefined) {
    return this._request(
      'PUT',
      `/xapi/anonymize/site/enabled?${queryString.stringify({ enable })}`,
      undefined,
      cb
    );
  }
}

export default Anonymization;
