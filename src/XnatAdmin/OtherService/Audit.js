import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:Audit`);

/**
 * the API Wrapper Class for the Audit APIs
 */
class Audit extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }
  /**
   * XNAT Events
   * @typedef XnatEvents
   * @property {XnatEvent[]} events - an Array of XNAT Events
   */

  /**
   * Xnat Event
   * @typedef XnatEvent
   * @property {string} event_action
   * @property {integer} event_id
   * @property {string} event_type
   * @property {string} event_reason
   * @property {integer} event_date
   * @property {string[]} changesets
   * @property {string} event_user
   * @property {string} event_category
   * @property {string} event_status
   */

  /**
   * Get An Audit Report On An XNAT Data Object
   * @param {string} xsiType - a valid XNAT datatype (xsiType) entry, such as xdat:user or xnat:mrSessionData
   * @param {string} objectId -  valid ID for the XNAT data object in question. For example, to view changes to a user's permission, you would supply "xdat:user" as the xsiType and the numerical user ID for the ID.
   * @param {function} [cb] - Callback function
   * @returns {XnatEvents} Xnat Events
   */
  getAuditReport(xsiType, objectId, cb = undefined) {
    return this._request(
      'GET',
      `/data/services/audit/${xsiType}/${objectId}`,
      undefined,
      cb
    );
  }
}

export default Audit;
