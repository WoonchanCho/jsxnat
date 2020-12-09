import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import XmlParser from '../Common/XmlParser';
import { IllegalArgumentsError } from '../Error';
import Resource from './Resource';

const log = debug(`${APP_NAME}:Workflow`);

/**
 * Wrapper class for the Workflow related APIs
 */
class Workflow extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Create A Workflow Entry From An XML Descriptor File
   * @param {string} xml Workflow Description XML
   * @param {function} [cb] Callback function
   * @returns none
   */
  createWorkflowWithRawXml(xml, cb = undefined) {
    return this._request(
      'PUT',
      `/data/workflows?inbody=true`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Create A New Workflow Entry With Querystring Parameters
   * @param {object} json a map of workflow fields
   * @param {function} [cb] Callback function
   * @returns none
   */
  createWorkflow(json, cb = undefined) {
    if (typeof json !== 'object') {
      throw new IllegalArgumentsError(`a map of workflow entry is not valid`);
    }
    return this._request(
      'PUT',
      `/data/workflows?${queryString.stringify(json)}`,
      undefined,
      cb
    );
  }

  /**
   * Change the Status Of A Workflow Entry
   * @param {string} workflowId Workflow id
   * @param {string} status Workflow status
   * @param {function} cb optional callback function
   * @returns none
   */
  updateWorkflowStatus(workflowId, status, cb = undefined) {
    return this._request(
      'PUT',
      `/data/workflows/${workflowId}?wrk:workflowData/status=${status}`,
      undefined,
      cb
    );
  }

  /**
   * Get A Workflow Entry By Querystring Parameters
   * @param {object} json a map of workflow fields
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getWorkflow(json, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (typeof json !== 'object') {
      throw new IllegalArgumentsError(`a map of workflow entry is not valid`);
    }

    return this._request('GET', `/data/workflows`, { ...json, format }, cb);
  }

  /**
   * Get A Workflow Entry By ID
   * @param {string} workflowId Workflow id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getWorkflowById(workflowId, format = RESPONSE_FORMAT.json, cb = undefined) {
    return this._request(
      'GET',
      `/data/workflows/${workflowId}`,
      { format },
      cb
    );
  }
}

export default Workflow;
