import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import { IllegalArgumentsError } from '../Error';

const log = debug(`${APP_NAME}:DataProcessing`);

/**
 * Data Processing related API
 */
class DataProcessing extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Get A Listing Of Pipelines In Your Project
   * @param {string} projectId project id
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of matched entities
   */
  getPipelines(projectId, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/projects/${projectId}/pipelines`,
      { format },
      cb
    );
  }

  /**
   * Get Details Of A Pipeline Execution Workflow Step
   * @param {string} projectId project id
   * @param {string} stepId step id
   * @param {string} experimentId experiment id
   * @param {function} cb optional callback function
   * @returns none
   */
  getPipelineStep(projectId, stepId, experimentId, cb = undefined) {
    return this._request(
      'GET',
      `/data/projects/${projectId}/pipelines/${stepId}/experiments/${experimentId}`,
      undefined,
      cb
    );
  }

  /**
   * Delete (Or Unshare) An Image Assessor
   * @param {string} xsiType xsiType e.g., xnat:mrSessionData
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON* @param {function} cb optional callback function
   * @returns none
   */
  getQueriableFields(xsiType, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!xsiType) {
      throw new IllegalArgumentsError(`xsiType is required`);
    }
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/search/elements/${xsiType}`,
      { format },
      cb
    );
  }

  /**
   * Get A List Of Search Report Versions For A Data Type
   * @param {string} xsiType xsiType e.g., xnat:mrSessionData
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getSearchReportVersionsFor(
    xsiType,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/search/elements/${xsiType}/versions`,
      { format },
      cb
    );
  }

  /**
   * Get List of Stored Searches
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getStoredSearches(format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request('GET', `/data/search/saved`, { format }, cb);
  }

  /**
   * Get List of Stored Searches
   * @param {string} id search id
   * @param {function} cb optional callback function
   */
  getStoredSearch(id, cb = undefined) {
    return this._request('GET', `/data/search/saved/${id}`, undefined, cb);
  }

  /**
   * Create A Stored Search
   * @param {string} xml The XML structure of the stored search you want to create. Refer to https://wiki.xnat.org/display/XNAT17/Share+Custom+Data+Tables+as+Stored+Searches+for+Project+Reporting for notes on formatting.
   * @param {function} cb optional callback function
   */
  createStoredSearch(xml, cb = undefined) {
    return this._request(
      'PUT',
      `/data/search/saved/xs${Date.now()}`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Update A Stored Search
   * @param {string} id The unique ID of the stored search
   * @param {string} xml The XML structure of the stored search you want to create. Refer to https://wiki.xnat.org/display/XNAT17/Share+Custom+Data+Tables+as+Stored+Searches+for+Project+Reporting for notes on formatting.
   * @param {function} cb optional callback function
   */
  updateStoredSearch(id, xml, cb = undefined) {
    return this._request(
      'PUT',
      `/data/search/saved/${id}`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Create A Stored Search
   * @param {string} id The unique ID of the stored search
   * @param {boolean} guiStyle  If this query parameter is set to true, the information returned will be run through the same formatting that information in the GUI is normally run through. This means that the results of the REST call will have the same columns and column headings as the table displayed in the GUI when the saved search is executed.
   * @param {string} xml The XML structure of the stored search you want to create. Refer to https://wiki.xnat.org/display/XNAT17/Share+Custom+Data+Tables+as+Stored+Searches+for+Project+Reporting for notes on formatting.
   * @param {function} cb optional callback function
   */
  getStoredSearchResult(
    id,
    guiStyle = false,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/search/saved/${id}/results`,
      { guiStyle, format },
      cb
    );
  }
}

export default DataProcessing;
