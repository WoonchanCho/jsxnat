import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:UISpawner`);

/**
 * the API Wrapper Class for the UI Spawner APIs
 */
class UISpawner extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Returns a single preference and value for this XNAT application.
   * @param {function} [cb] - Callback function
   * @returns {string[]} A list of spawner element namespaces.
   */
  getElementNamespaces(cb = undefined) {
    return this._request('GET', `/xapi/spawner/namespaces`, undefined, cb);
  }

  /**
   * Get list of element IDs in the system's default namespace.
   * @param {string} [namespace] - if empty, element Ids in the default namespace will be looked up
   * @param {function} [cb] Callback function
   * @returns {string[]} A list of spawner element namespaces.
   */
  getElementIdsInNamespace(namespace = undefined, cb = undefined) {
    const path = namespace
      ? `/xapi/spawner/ids/${namespace}`
      : `/xapi/spawner/ids`;
    return this._request('GET', path, undefined, cb);
  }
}

export default UISpawner;
