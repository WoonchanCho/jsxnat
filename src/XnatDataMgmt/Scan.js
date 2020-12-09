import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import Resource from './Resource';
import DicomDump from './DicomDump';

const log = debug(`${APP_NAME}:Scan`);

/**
 * Scan related API
 */
class Scan extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Scan Data REST XML Path Shortcuts
   */
  static ScanXmlPathShortcuts = {
    Common: {
      ID: 'xnat:imageScanData/ID',
      type: 'xnat:imageScanData/type',
      UID: 'xnat:imageScanData/UID',
      note: 'xnat:imageScanData/note',
      quality: 'xnat:imageScanData/quality',
      condition: 'xnat:imageScanData/condition',
      series_description: 'xnat:imageScanData/series_description',
      documentation: 'xnat:imageScanData/documentation',
      scanner: 'xnat:imageScanData/scanner',
      modality: 'xnat:imageScanData/modality',
      frames: 'xnat:imageScanData/frames',
      validation_method: 'xnat:imageScanData/validation/method',
      validation_status: 'xnat:imageScanData/validation/status',
      validation_date: 'xnat:imageScanData/validation/date',
      validation_notes: 'xnat:imageScanData/validation/notes',
      last_modified: 'xnat:imageScanData/meta/last_modified',
      insert_date: 'xnat:imageScanData/meta/insert_date',
      insert_user: 'xnat:imageScanData/meta/insert_user',
    },
    MR: {
      coil: 'xnat:mrScanData/coil',
      fieldStrength: 'xnat:mrScanData/fieldStrength',
      marker: 'xnat:mrScanData/marker',
      stabilization: 'xnat:mrScanData/stabilization',
    },
    PET: {
      orientation: 'xnat:petScanData/parameters/orientation',
      scanTime: 'xnat:petScanData/parameters/scanTime',
      originalFileName: 'xnat:petScanData/parameters/originalFileName',
      systemType: 'xnat:petScanData/parameters/systemType',
      fileType: 'xnat:petScanData/parameters/fileType',
      transaxialFOV: 'xnat:petScanData/parameters/transaxialFOV',
      acqType: 'xnat:petScanData/parameters/acqType',
      facility: 'xnat:petScanData/parameters/facility',
      numPlanes: 'xnat:petScanData/parameters/numPlanes',
      numFrames: 'xnat:petScanData/parameters/frames/numFrames',
      numGates: 'xnat:petScanData/parameters/numGates',
      planeSeparation: 'xnat:petScanData/parameters/planeSeparation',
      binSize: 'xnat:petScanData/parameters/binSize',
      dataType: 'xnat:petScanData/parameters/dataType',
    },
  };

  /**
   * Get A Listing Of Scans From An Image Session
   * @param {object} options experient identification options
   * @param {string} options.projectId Optional. project id
   * @param {string} options.subjectIdOrLabel Optional. subject id or label
   * @param {string} options.experimentId Optional. experiment id
   * @param {string} options.experimentLabel Optional. experiment label
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns none
   */
  getScans(
    { projectId, subjectIdOrLabel, experimentId, experimentLabel },
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    const path = experimentId
      ? `/data/experiments/${experimentId}/scans`
      : `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentLabel}/scans`;
    return this._request('GET', path, { format }, cb);
  }

  /**
   * Get A Listing Of A Single Scan's Resources
   * @param {object} options experient identification options
   * @param {string} options.projectId Optional. project id
   * @param {string} options.subjectIdOrLabel Optional. subject id or label
   * @param {string} options.experimentId Optional. experiment id
   * @param {string} options.experimentLabel Optional. experiment label
   * @param {string} scanId scan id
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns none
   */
  getScanResources(
    { projectId, subjectIdOrLabel, experimentId, experimentLabel },
    scanId,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    const path = experimentId
      ? `/data/experiments/${experimentId}/scans/${scanId}`
      : `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentLabel}/scans/${scanId}`;
    return this._request('GET', path, { format }, cb);
  }

  /**
   * Add Scan To An Image Session
   * @param {object} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {string} xsiType scan id
   * @param {object} json refer to ScanXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Subject+Data+REST+XML+Path+Shortcuts
   * @param {function} cb optional callback function
   * @returns none
   */
  createScan(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    xsiType,
    json,
    cb = undefined
  ) {
    const options = queryString.stringify({ xsiType, ...json });
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}?${options}`,
      undefined,
      cb
    );
  }

  /**
   * Modify Scan Metadata
   * @param {object} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {string} xsiType xsiType e.g., xnat:mrScanData
   * @param {object} json refer to ScanXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Subject+Data+REST+XML+Path+Shortcuts
   * @param {function} cb optional callback function
   * @returns none
   */
  updateScan(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    xsiType,
    json,
    cb = undefined
  ) {
    const options = queryString.stringify({ xsiType, ...json });
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}?${options}`,
      undefined,
      cb
    );
  }

  /**
   * Modify Scan Metadata
   * @param {object} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {boolean} removeFiles Optional query param. Defaults to "FALSE", which will leave files in the file system after deleting the experiment record in Postgres. When this param is set to "TRUE", those files are permanently deleted.
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteScan(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    removeFiles = false,
    cb = undefined
  ) {
    return this._request(
      'DELETE',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      // `/data/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      { removeFiles },
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
  getDicomDump(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    fields = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return DicomDump.createDicomDump(this).getDumpForScan(
      projectId,
      subjectIdOrLabel,
      experimentIdOrLabel,
      scanId,
      fields,
      format,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Folders Stored With A Subject
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFolders(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFolders(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Project
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFiles(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFiles(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Project
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   */
  getFile(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).getFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }

  /**
   * Create A New Project Resource Folder
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {string} resourceLabel resource label (folder name)
   * @param {string} format Optional. Specify a string format descriptor for this resource folder.
   * @param {string | array} tags Optional. Specify a comma-separated list of tags for this resource folder.
   * @param {string} contents Optional. Specify a string description of the resource folder's content.
   * @param {function} cb optional callback function
   * @returns none
   */
  createFolder(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    resourceLabel,
    format = undefined,
    tags = [],
    content = undefined,
    cb = undefined
  ) {
    return Resource.createResource(this).createFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      resourceLabel,
      format,
      tags,
      content,
      cb
    );
  }

  /**
   * Upload A New Project Resource File
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {Buffer} file file buffer (need to check if this is compatilable from browser)
   * @param {boolean} overwrite Optional. overwrite the file if the file that has the same filename already exists in the same location
   * @param {function} cb optional callback function
   * @returns none
   */
  uploadFile(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    resourceIdOrLabel,
    filename,
    file,
    overwrite = false,
    cb = undefined
  ) {
    return Resource.createResource(this).uploadFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      resourceIdOrLabel,
      filename,
      file,
      overwrite,
      cb
    );
  }

  /**
   * Delete A Project Resource Folder
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {boolean} safe Optional. if throw errors if files exists in the resource folder
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteFolder(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    resourceIdOrLabel,
    safe = false,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      resourceIdOrLabel,
      safe,
      cb
    );
  }

  /**
   * Delete A Project Resource File
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} scanId scan id
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   * @returns none
   */

  deleteFile(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    scanId,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/scans/${scanId}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }
}

export default Scan;
