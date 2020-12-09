import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:UiTheme`);

/**
 * the API Wrapper Class for the UI Theme APIs
 */
class UiTheme extends Requestable {
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

export default UiTheme;
