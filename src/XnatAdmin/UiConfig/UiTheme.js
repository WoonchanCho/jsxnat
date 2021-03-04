import Requestable from '../../Common/Requestable';

/**
 * the API Wrapper Class for the UI Theme APIs
 */
export default class UiTheme extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Get list of available themes.
   * @param {function} [cb] - Callback function
   */
  getAvailableThemes(cb = undefined) {
    return this._request('GET', `/xapi/theme`, undefined, cb);
  }
}
