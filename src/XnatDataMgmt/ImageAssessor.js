import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import { IllegalArgumentsError } from '../Error';
import Resource from './Resource';

const log = debug(`${APP_NAME}:ImageAssessor`);

/**
 * Image Assessor related API
 */
class ImageAssessor extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Get All Assessors Associated With An Image Session
   * @param {string} options.projectId Optional. project id
   * @param {string} options.subjectIdOrLabel Optional. subject id or label
   * @param {string} options.experimentId Optional. experiment id
   * @param {string} options.experimentLabel Optional. experiment label
   * @param {string | array} columns Optional. Column names can be either properties of ExperimentXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Experiment+Data+REST+XML+Path+Shortcuts
   * @param {string | number | object} fromDate Optional. from-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {string | number | object} toDate Optional. to-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {object} conditions Optional. restrict the search by any string parameter listed in Experiment Data REST XML Path Shortcuts. e.g., {xsiType: 'xnat:mrSessionData', ID :'XNAT_E0001*'}
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getAssessors(
    { projectId, subjectIdOrLabel, experimentId, experimentLabel },
    columns = [],
    fromDate,
    toDate,
    conditions,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    const date = this.__createDateRange(fromDate, toDate);
    const path = experimentId
      ? `/data/experiments/${experimentId}/assessors`
      : `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentLabel}/assessors`;
    return this._request(
      'GET',
      path,
      {
        columns,
        date,
        format,
        ...conditions,
      },
      cb
    );
  }

  /**
   * Get A Specific Assessor Associated With An Image Session
   * @param {string} options.projectId project id
   * @param {string} options.subjectIdOrLabel subject id or label
   * @param {string} options.experimentId experiment id
   * @param {string} options.experimentLabel experiment label
   * @param {string} options.assessorId assessor id
   * @param {string} options.asessorLabel assessor label
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getAssessor(
    {
      projectId,
      subjectIdOrLabel,
      experimentId,
      experimentLabel,
      assessorId,
      assessorLabel,
    },
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (
      (!assessorId && !assessorLabel) ||
      (!experimentId && !experimentLabel) ||
      (!experimentId && (!projectId || !subjectIdOrLabel))
    ) {
      throw new IllegalArgumentsError(
        `the provided info is not enough to identify an assessor`
      );
    }
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    let path = undefined;
    if (experimentId !== undefined) {
      path = `/data/experiments/${experimentId}/assessors/${
        assessorId ? assessorId : assessorLabel
      }`;
    } else {
      path = `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${
        experimentId ? experimentId : experimentLabel
      }/assessors/${assessorId ? assessorId : assessorLabel}`;
    }
    return this._request('GET', path, { format }, cb);
  }

  /**
   * Create A New Image Assessor
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentLabel experiment label
   * @param {object} xml assessor xml
   * @param {function} cb optional callback function
   * @returns {string} a simple string of the new assessor ID
   */
  createAssessor(
    projectId,
    subjectIdOrLabel,
    experimentLabel,
    xml,
    cb = undefined
  ) {
    if (!xml) {
      throw new IllegalArgumentsError(`assessor xml is required`);
    }
    return this._request(
      'POST',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentLabel}/assessors?inbody=true`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Modify An Existing Image Assessor
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {object} xml assessor xml
   * @param {function} cb optional callback function
   * @returns {string} a simple string of the updated experiment's accession ID
   */
  updateAssessor(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    xml,
    cb = undefined
  ) {
    if (!xml) {
      throw new IllegalArgumentsError(`assessor xml is required`);
    }
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}?inbody=true`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Update an experiment represented by XML
   * @param {string} options.projectId project id
   * @param {string} options.subjectId subject id
   * @param {string} options.subjectLabel subject label
   * @param {string} xml project xml representation
   * @param {function} cb optional callback function
   * @returns {string} a simple string of the updated experiment's accession ID
   */
  updateExperimentWithRawXml(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    xml,
    cb = undefined
  ) {
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Share An Image Assessor Into A New Project
   * @param {string} originalProjectId the ID of the project that owns a given experiment.
   * @param {string} sharedProjectId the ID of the project that you intend an experiment to be shared into
   * @param {string} subjectIdOrLabel subject id or label of the experiment to be shared
   * @param {string} experimentIdOrLabel experiment id or label to be shared
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {string} newLabel Optional. Specify a new label for this experiment that will be used in the shared project, if desired.
   * @param {string} primary Optional. If set to "true", you are changing the primary ownership of the subject from the original project to the new project.
   * @param {function} cb optional callback function
   * @returns {string} the experiment accession ID as a string
   */
  shareAssessor(
    originalProjectId,
    sharedProjectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    newLabel = undefined,
    primary = false,
    cb = undefined
  ) {
    const options = queryString.stringify({ label: newLabel, primary });
    return this._request(
      'PUT',
      `/data/projects/${originalProjectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}/projects/${sharedProjectId}?${options}`,
      undefined,
      cb
    );
  }

  /**
   * Get A List Of Shared Projects Associated With An Experiment
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label to be shared
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of all projects associated with a subject. The root project ID in the URI can be either a project that owns the subject or a shared project.
   */
  getSharedProjects(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}/projects`,
      {
        format,
      },
      cb
    );
  }

  /**
   * Delete (Or Unshare) An Image Assessor
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label to be shared
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteAssessor(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    cb = undefined
  ) {
    return this._request(
      'DELETE',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
      undefined,
      cb
    );
  }

  /**
   * Delete (Or Unshare) An Image Assessor
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label to be shared
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {function} cb optional callback function
   * @returns none
   */
  unshareExperiment(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    cb = undefined
  ) {
    return this.deleteSubject(
      projectId,
      subjectIdOrLabel,
      experimentIdOrLabel,
      assessorIdOrLabel,
      cb
    );
  }

  /**
   * Get A Listing Of All Resource Collections Stored With An Image Assessor
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFolders(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFolders(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
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
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFiles(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFiles(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
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
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   */
  getFile(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).getFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
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
   * @param {string} assessorIdOrLabel assessor id or label
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
    assessorIdOrLabel,
    resourceLabel,
    format = undefined,
    tags = [],
    content = undefined,
    cb = undefined
  ) {
    return Resource.createResource(this).createFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
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
   * @param {string} assessorIdOrLabel assessor id or label
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
    assessorIdOrLabel,
    resourceIdOrLabel,
    filename,
    file,
    overwrite = false,
    cb = undefined
  ) {
    return Resource.createResource(this).uploadFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
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
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {boolean} safe Optional. if throw errors if files exists in the resource folder
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteFolder(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    resourceIdOrLabel,
    safe = false,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
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
   * @param {string} assessorIdOrLabel assessor id or label
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   * @returns none
   */

  deleteFile(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    assessorIdOrLabel,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/assessors/${assessorIdOrLabel}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }
  //chany

  /**
   * Get A Listing Of Pipelines In Your Project
   * @param {string} code
   * @param {obj} obj
   * @returns {boolean} returns true if the code exists in the property of the object.
   */
  __isOneOf(code, obj) {
    return Object.values(obj).find((c) => c == parseInt(code)) !== undefined;
  }

  __convertSubjectColumns(columns) {
    if (columns === undefined) {
      return columns;
    }
    if (!Array.isArray(columns)) {
      columns = [columns];
    }
    return columns
      .map((column) =>
        SubjectCommon.SubjectXmlPathShortcuts[column]
          ? SubjectCommon.SubjectXmlPathShortcuts[column]
          : column
      )
      .join(',');
  }

  __convertDate(date) {
    if (!date) {
      return undefined;
    }
    if (typeof date === 'number') {
      const dt = new Date(date);
      let year = dt.getFullYear();
      let month = (1 + dt.getMonth()).toString().padStart(2, '0');
      let day = dt.getDate().toString().padStart(2, '0');
      return month + '/' + day + '/' + year;
    } else if (typeof date === 'object') {
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return month + '/' + day + '/' + year;
    } else {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/\d{4}$/;
      if (!dateRegex.test(date)) {
        throw new IllegalArgumentsError(`date is invalid: ${date}`);
      }
      return date;
    }
  }

  __createDateRange(fromDate, toDate) {
    const cleansedFromDate = this.__convertDate(fromDate);
    const cleansedToDate = this.__convertDate(toDate);

    if (fromDate && toDate) {
      return `${cleansedFromDate}-${cleansedToDate}`;
    } else if (fromDate) {
      return cleansedFromDate;
    } else if (toDate) {
      return cleansedToDate;
    } else {
      return undefined;
    }
  }
}

export default ImageAssessor;
