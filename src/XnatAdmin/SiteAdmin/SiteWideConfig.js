import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:SiteWideConfig`);

/**
 * Site-wide Configuration API
 */
class SiteWideConfig extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Returns the full map of site configuration properties.
   * @param {string | undefined} key optional configuration property key
   * @param {function | undefined} cb optional callback function
   */
  getSiteConfig(key = undefined, cb = undefined) {
    const path = '/xapi/siteConfig' + (key ? `/${key}` : '');
    return this._request('GET', path, undefined, cb);
  }

  /**
   * Sets a map of site configuration properties.
   * @param {object} config configuration properrties object to be updated (added)
   * @param {function | undefined} cb optional callback function
   */
  setSiteConfig(config, cb = undefined) {
    if (config === undefined || typeof config !== 'object') {
      throw new IllegalArgumentsError('illegal config is entered');
    }
    return this._request('POST', '/xapi/siteConfig', config, cb);
  }

  /**
   * Sets a single site configuration property.
   * @param {string } key configuration property key
   * @param {string | object} value configuration property value
   * @param {function | undefined} cb optional callback function
   */
  setSingleSiteConfig(key, value, cb = undefined) {
    if (key === undefined) {
      throw new IllegalArgumentsError('key is required');
    }
    if (value === undefined) {
      throw new IllegalArgumentsError('value is required');
    }
    return this._request('POST', `/xapi/siteConfig/${key}`, value, cb);
  }

  /**
   * Returns a map of application build properties.
   * @param {string} key optional configuration property key
   * @param {function} cb optional callback function
   */
  getBuildInfo(key = undefined, cb = undefined) {
    const path = '/xapi/siteConfig/buildInfo' + (key ? `/${key}` : '');
    return this._request('GET', path, undefined, cb);
  }

  /**
   * Returns the system uptime.
   * @param {function | undefined} cb optional callback function
   */
  getUptime(cb = undefined) {
    return this._request('GET', '/xapi/siteConfig/uptime', undefined, cb);
  }

  /**
   * Returns the system uptime.
   * @param {function | undefined} cb optional callback function
   */
  getDisplayableUptime(cb = undefined) {
    return this._request(
      'GET',
      '/xapi/siteConfig/uptime/display',
      undefined,
      cb
    );
  }

  /**
   * Returns a map of the selected site configuration properties.
   * @param {string} key the site configuration property key
   * @param {function | undefined} cb optional callback function
   */
  getSiteConfigValue(key, cb = undefined) {
    if (key === undefined) {
      throw new IllegalArgumentsError('key is required');
    }
    const path = `/xapi/siteConfig/values/${key}`;
    return this._request('GET', path, undefined, cb);
  }
}

export default SiteWideConfig;
