import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:Plugin`);

/**
 * Wrapper class for the Subject related APIs
 */
class Plugin extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Installed Plugin Class
   * @typedef InstalledPlugin
   * @property {string} pluginClass
   * @property {object} extendedAttributes
   * @property {string} beanName
   * @property {string} logConfigurationFile
   * @property {string[]} entityPackages
   * @property {DataModelBean[]} dataModelBeans
   * @property {string} name
   * @property {string} id
   * @property {string} version
   */

  /**
   * Data Model Bean Class
   * @typedef DataModelBean
   * @property {string} code
   * @property {string} type
   * @property {boolean} secured
   * @property {string} singular
   * @property {string} plural
   */

  /**
   * Returns a list of all of the installed and active XNAT plugins with their properties.
   * @param {function} [cb] - Callback function
   * @returns {InstalledPlugin[]} Installed plugin object array
   */
  getInstalledPlugins(cb = undefined) {
    return this._request('GET', `/xapi/plugins`, undefined, cb);
  }

  /**
   * Returns the indicated XNAT plugin with its properties.
   * @param {string} pluginId - Plugin ID
   * @param {function} [cb] - Callback function
   * @returns {InstalledPlugin} Installed plugin object
   */
  getInstalledPlugin(pluginId, cb = undefined) {
    return this._request('GET', `/xapi/plugins/${pluginId}`, undefined, cb);
  }

  /**
   * Gets the plugin open URL configuration.
   * @param {function} [cb] - Callback function
   * @returns {InstalledPlugin} Installed plugin object
   */
  getOpenUrlSettings(cb = undefined) {
    return this._request('GET', `/xapi/pluginOpenUrls/settings`, undefined, cb);
  }

  /**
   * Sets the plugin open URL configuration.
   * @param {object} [json] - e.g. { "additionalProp1": true, "additionalProp2": true }
   * @param {function} [cb] - Callback function
   * @returns none
   */
  setOpenUrlSettings(json, cb = undefined) {
    if (!json || typeof json !== 'object') {
      throw new IllegalArgumentsError('json is not valid');
    }
    return this._request('POST', `/xapi/pluginOpenUrls/settings`, json, cb);
  }
}

export default Plugin;
