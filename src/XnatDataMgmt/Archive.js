import FormData from 'isomorphic-form-data';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import { IllegalArgumentsError } from '../Error';

const log = debug(`${APP_NAME}:Archive`);

/**
 * Archive related API
 */
class Archive extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Upload (Import) An Image Session
   * @param {string} filename filename
   * @param {Bufer} buffer file buffer
   * @param {string} options.overwrite Optional.
   * @param {string} options.quarantine Optional.
   * @param {string} options.triggerPipelines Optional.
   * @param {string} options.src Optional. Only used when attempting to import a previously uploaded file. You can specify multiple src attributes or separate them with commas.
   * @param {string} options.dest Optional.
   * @param {string} options['import-handler'] Optional. Defaults to standard import logic ("SI"). Client can specify a key using free-form text which the server maps to a different implementation of the import logic. See above.
   * @param {string} options['http-session-listener'] Optional. Used by the web based zip uploader
   * @param {string} options.rename Optional. Used with the gradual-DICOM importer, instructing XNAT to ignore the original dicom file name and rename it. Default is false.
   * @param {string} options.PROJECT_ID Optional. For use when not using dest attribute
   * @param {string} options.SUBJECT_ID Optional. For use when not using dest attribute
   * @param {string} options.EXPT_LABEL Optional. For use when not using dest attribute
   * @param {function} cb optional callback function
   * @returns none
   */
  uploadSession(filename, buffer, options = {}, cb = undefined) {
    if (!filename) {
      throw new IllegalArgumentsError(`filename is required`);
    }
    if (!buffer) {
      throw new IllegalArgumentsError(`file is required`);
    }

    const formData = new FormData();
    formData.append('image_archive', buffer, {
      filename,
    });
    Object.keys(options).forEach((option) => {
      formData.append(option, options[option]);
    });

    return this._request(
      'POST',
      `/data/services/import`,
      formData,
      cb,
      CONTENT_TYPES.multipart
    );
  }

  /**
   * Check The Status Of An Upload
   * @param {string} uploadId project id
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  checkUploadStatus(uploadId, format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }

    return this._request('GET', `/data/status/${uploadId}`, undefined, cb);
  }

  /**
   * Reset The Status Of An Upload
   * @param {string} uploadId project id
   * @param {function} cb optional callback function
   */
  resetUploadStatus(uploadId, cb = undefined) {
    return this._request(
      'GET',
      `/servlet/AjaxServlet?remote-class=org.nrg.xnat.ajax.UploadProgress&remote-method=start&ID=${uploadId}`,
      undefined,
      cb
    );
  }
}

export default Archive;
