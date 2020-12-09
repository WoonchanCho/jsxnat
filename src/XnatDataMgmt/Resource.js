import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, RESPONSE_FORMAT, CONTENT_TYPES } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import { IllegalArgumentsError, UnsafeError } from '../Error';

const log = debug(`${APP_NAME}:Resource`);

/**
 * Resource related API
 */
class Resource extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }
  /**
   * creates and returns an Resource object that has the exact same auth and apibase parmeter as the object provided
   * @param {Requestable} any object that extends Requestable
   * @returns {Resorce} new resource object
   */
  static createResource(entity) {
    const { __auth, __apiBase } = entity;
    return new Resource(__auth, __apiBase);
  }

  /**
   * Get A Listing Of Resource Folders
   * @param {string} path the path of the entitiy for the resource (the path of Project, Subject, Image Assessor, or Scan)
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFolders(path, sortBy = [], format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!sortBy) {
      sortBy = [];
    }
    if (!Array.isArray(sortBy)) {
      sortBy = sortBy.split(',');
    }
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `${path}/resources`,
      {
        sortBy: sortBy.join(','),
        format,
      },
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Entity specifed in the path parameter
   * @param {string} path the path of the entitiy for the resource (the path of Project, Subject, Image Assessor, or Scan)
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFiles(path, sortBy = [], format = RESPONSE_FORMAT.json, cb = undefined) {
    if (!sortBy) {
      sortBy = [];
    }
    if (!Array.isArray(sortBy)) {
      sortBy = sortBy.split(',');
    }
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `${path}/files`,
      {
        sortBy: sortBy.join(','),
        format,
      },
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Entity specifed in the path parameter
   * @param {string} path the path of the entitiy for the resource (the path of Project, Subject, Image Assessor, or Scan)
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   */
  getFile(path, resourceIdOrLabel, filename, cb = undefined) {
    return this._request(
      'GET',
      `${path}/resources/${resourceIdOrLabel}/files/${filename}`,
      undefined,
      cb
    );
  }

  /**
   * Create A New Resource Folder
   * @param {string} path the path of the entitiy for the resource (the path of Project, Subject, Image Assessor, or Scan)
   * @param {string} resourceLabel resource label (folder name)
   * @param {string} format Optional. Specify a string format descriptor for this resource folder.
   * @param {string | array} tags Optional. Specify a comma-separated list of tags for this resource folder.
   * @param {string} contents Optional. Specify a string description of the resource folder's content.
   * @param {function} cb optional callback function
   * @returns none
   */
  createFolder(
    path,
    resourceLabel,
    format = undefined,
    tags = [],
    content = undefined,
    cb = undefined
  ) {
    if (!resourceLabel) {
      throw new IllegalArgumentsError('resource label is required');
    }
    if (tags && !Array.isArray(tags)) {
      tags = tags.split(',');
    }
    const options = queryString.stringify({
      format,
      tags: tags ? tags.join(',') : undefined,
      content,
    });
    return this._request(
      'PUT',
      `${path}/resources/${resourceLabel}?${options}`,
      undefined,
      cb
    );
  }

  /**
   * Upload A New Resource File
   * @param {string} path the path of the entitiy for the resource (the path of Project, Subject, Image Assessor, or Scan)
   * @param {string} resourceIdOrLabel resource id or label
   * @param {string} filename filename
   * @param {Buffer} file file buffer (need to check if this is compatilable from browser)
   * @param {boolean} overwrite Optional. overwrite the file if the file that has the same filename already exists in the same location
   * @param {function} cb optional callback function
   * @returns none
   */
  uploadFile(
    path,
    resourceIdOrLabel,
    filename,
    file,
    overwrite = false,
    cb = undefined
  ) {
    if (!resourceIdOrLabel) {
      throw new IllegalArgumentsError('resource id or label is required');
    }
    if (!filename) {
      throw new IllegalArgumentsError('filename is required');
    }
    if (!file) {
      throw new IllegalArgumentsError('file is required');
    }
    return this._request(
      'PUT',
      `${path}/resources/${resourceIdOrLabel}/files/${filename}${
        overwrite === true ? '?overwrite=true' : ''
      }`,
      file,
      cb,
      CONTENT_TYPES.binary
    );
  }

  /**
   * Delete A Resource Folder
   * @param {string} path the path of the entitiy for the resource (the path of Project, Subject, Image Assessor, or Scan)
   * @param {string} resourceIdOrLabel resource id or label
   * @param {boolean} safe Optional. if throw errors if files exists in the resource folder
   * @param {function} cb optional callback function
   * @returns none
   */
  async deleteFolder(path, resourceIdOrLabel, safe = false, cb = undefined) {
    if (!resourceIdOrLabel) {
      throw new IllegalArgumentsError('resource id or label is required');
    }
    if (safe) {
      log('#@$#%3454354325432543253255343');
      const {
        ResultSet: { Result: res },
      } = await this.getFolders(path);

      const found = res.find(
        (item) =>
          item.label === resourceIdOrLabel ||
          item.xnat_abstractresource_id === resourceIdOrLabel
      );
      if (found && found.file_count > 0) {
        throw new UnsafeError('the specified folder contains files');
      }
    }
    return this._request(
      'DELETE',
      `${path}/resources/${resourceIdOrLabel}`,
      undefined,
      cb
    );
  }

  /**
   * Delete A Resource File
   * @param {string} path the path of the entitiy for the resource (the path of Project, Subject, Image Assessor, or Scan)
   * @param {string} resourceIdOrLabel resource id or label
   * @param {string} filename filename
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteFile(path, resourceIdOrLabel, filename, cb = undefined) {
    if (!resourceIdOrLabel) {
      throw new IllegalArgumentsError('resource id or label is required');
    }
    if (!filename) {
      throw new IllegalArgumentsError('filename is required');
    }
    return this._request(
      'DELETE',
      `${path}/resources/${resourceIdOrLabel}/files/${filename}`,
      undefined,
      cb
    );
  }
}

export default Resource;
