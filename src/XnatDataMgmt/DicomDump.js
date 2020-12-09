import debug from 'debug';
import { APP_NAME, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';

const log = debug(`${APP_NAME}:DicomDump`);

/**
 * DicomDump related API
 */
class DicomDump extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * creates and returns an DicomDump object that has the exact same auth and apibase parmeter as the object provided
   * @param {Requestable} any object that extends Requestable
   * @returns {DicomDump} new resource object
   */
  static createDicomDump(entity) {
    const { __auth, __apiBase } = entity;
    return new DicomDump(__auth, __apiBase);
  }

  /**
   * returns dicom header dump for a session
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {array | string} fields Optional. tag name or tag number to display
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of matched entities
   */
  getDumpForSession(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    fields = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this.__getDump(
      `/archive/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
      fields,
      format,
      cb
    );
  }

  /**
   * returns dicom header dump for a scan
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {array | string} fields Optional. tag name or tag number to display
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of matched entities
   */
  getDumpForScan(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    fields = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this.__getDump(
      `/archive/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      fields,
      format,
      cb
    );
  }

  /**
   * returns dicom header dump for a prearchive session
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {array | string} fields Optional. tag name or tag number to display
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of matched entities
   */
  getDumpForPrearchiveSession(
    src,
    fields = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this.__getDump(src, fields, format, cb);
  }

  /**
   * returns dicom header dump
   * @param {string} src source path
   * @param {array | string} fields Optional. tag name or tag number to display
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of matched entities
   */
  __getDump(src, fields = [], format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/services/dicomdump`,
      {
        src,
        field:
          fields === undefined || Array.isArray(fields)
            ? fields
            : fields.split(','),
        format,
      },
      cb
    );
  }
}

export default DicomDump;
