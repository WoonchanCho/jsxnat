import debug from 'debug';
import { APP_NAME, CONTENT_TYPES } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';

const log = debug(`${APP_NAME}:FileMover`);

/**
 * the API Wrapper Class for the File Mover Service APIs
 */
class FileMover extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Set a value for a single preference
   * @param {string} src - Specifies the source file path relative to your XNAT application, including the file name. e.g. /cache/USERS/{User ID}/{resource_name}/{file_name}
   * @param {string} dest - Specifies the intended destination file path relative to your XNAT application, including the file name. e.g. /archive/projects/{project_id}/resources/{resource_name}/{file_name}
   * @param {boolean} [ovewrite=false] - Allow file move to overwrite files at the destination path if true
   * @param {function} [cb] - callback function
   */
  moveFile(src, dest, overwrite = false, cb = undefined) {
    return this._request(
      'POST',
      `/data/services/move-files`,
      { src, dest, overwrite },
      cb,
      CONTENT_TYPES.form
    );
  }
}

export default FileMover;
