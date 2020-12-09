import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import { IllegalArgumentsError } from '../Error';
import Resource from './Resource';

const log = debug(`${APP_NAME}:Experiment`);

/**
 * Experiment (Subject Assessor) related API
 */
class Experiment extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Experiment Xml Path Shortcuts objects
   */
  static ExperimentXmlPathShortcuts = {
    Experiment: {
      visit_id: 'xnat:experimentdata/visit_id',
      date: 'xnat:experimentdata/date',
      ID: 'xnat:experimentdata/ID',
      project: 'xnat:experimentdata/project',
      label: 'xnat:experimentdata/label',
      time: 'xnat:experimentdata/time',
      note: 'xnat:experimentdata/note',
      pi_firstname: 'xnat:experimentdata/investigator/firstname',
      pi_lastname: 'xnat:experimentdata/investigator/lastname',
      validation_method: 'xnat:experimentdata/validation/method',
      validation_status: 'xnat:experimentdata/validation/status',
      validation_date: 'xnat:experimentdata/validation/date',
      validation_notes: 'xnat:experimentdata/validation/notes',
      last_modified: 'xnat:experimentdata/meta/last_modified',
      insert_date: 'xnat:experimentdata/meta/insert_date',
      insert_user: 'xnat:experimentdata/meta/insert_user',
    },
    Subject: {
      subject_ID: 'xnat:subjectData/ID',
      subject_label: 'xnat:subjectData/label',
      subject_project: 'xnat:subjectData/project',
    },
    ImageSession: {
      scanner: 'xnat:imageSessionData/scanner',
      operator: 'xnat:imageSessionData/operator',
      dcmAccessionNumber: 'xnat:imageSessionData/dcmAccessionNumber',
      dcmPatientId: 'xnat:imageSessionData/dcmPatientId',
      dcmPatientName: 'xnat:imageSessionData/dcmPatientName',
      session_type: 'xnat:imageSessionData/session_type',
      modality: 'xnat:imageSessionData/modality',
      UID: 'xnat:imageSessionData/UID',
    },
    MRSession: {
      coil: 'xnat:mrSessionData/coil',
      fieldStrength: 'xnat:mrSessionData/fieldStrength',
      marker: 'xnat:mrSessionData/marker',
      stabilization: 'xnat:mrSessionData/stabilization',
    },
    PETSession: {
      studyType: 'xnat:petSessionData/studyType',
      patientID: 'xnat:petSessionData/patientID',
      patientName: 'xnat:petSessionData/patientName',
      stabilization: 'xnat:petSessionData/stabilization',
      scan_start_time: 'xnat:petSessionData/start_time/scan',
      injection_start_time: 'xnat:petSessionData/start_time/injection',
      tracer_name: 'xnat:petSessionData/tracer/name',
      tracer_startTime: 'xnat:petSessionData/tracer/startTime',
      tracer_dose: 'xnat:petSessionData/tracer/dose',
      tracer_sa: 'xnat:petSessionData/tracer/specificActivity',
      tracer_totalmass: 'xnat:petSessionData/tracer/totalMass',
      tracer_intermediate: 'xnat:petSessionData/tracer/intermediate',
      tracer_isotope: 'xnat:petSessionData/tracer/isotope',
      tracer_isotope: 'xnat:petSessionData/tracer/isotope/half-life',
      tracer_transmissions: 'xnat:petSessionData/tracer/transmissions',
      tracer_transmissions_start:
        'xnat:petSessionData/tracer/transmissions/startTime',
    },
  };

  /**
   * Get All Experiments In XNAT
   * @param {string | array} columns Optional. Column names can be either properties of ExperimentXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Experiment+Data+REST+XML+Path+Shortcuts
   * @param {string | number | object} fromDate Optional. from-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {string | number | object} toDate Optional. to-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {object} conditions Optional. restrict the search by any string parameter listed in Experiment Data REST XML Path Shortcuts. e.g., {xsiType: 'xnat:mrSessionData', ID :'XNAT_E0001*'}
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getAllExperiments(
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
    return this._request(
      'GET',
      `/data/experiments`,
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
   * Get All Experiments In A Project
   * @param {string} projectId project id
   * @param {string | array} columns Optional. Column names can be either properties of ExperimentXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Experiment+Data+REST+XML+Path+Shortcuts
   * @param {string | number | object} fromDate Optional. from-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {string | number | object} toDate Optional. to-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {object} conditions Optional. restrict the search by any string parameter listed in Experiment Data REST XML Path Shortcuts. e.g., {xsiType: 'xnat:mrSessionData', ID :'XNAT_E0001*'}
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getExperimentsInProject(
    projectId,
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
    return this._request(
      'GET',
      `/data/projects/${projectId}/experiments`,
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
   * Get All Experiments For A Subject
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string | array} columns Optional. Column names can be either properties of ExperimentXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Experiment+Data+REST+XML+Path+Shortcuts
   * @param {string | number | object} fromDate Optional. from-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {string | number | object} toDate Optional. to-date condition. can be formatted as MM/DD/YYYY or be timestamp. Timestamp ignores hours, mins....
   * @param {object} conditions Optional. restrict the search by any string parameter listed in Experiment Data REST XML Path Shortcuts. e.g., {xsiType: 'xnat:mrSessionData', ID :'XNAT_E0001*'}
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getExperimentsInSubject(
    projectId,
    subjectIdOrLabel,
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
    return this._request(
      'GET',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments`,
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
   * Get A Single Experiment Record
   * @param {string} options.projectId project id
   * @param {string} options.subjectIdOrLabel subject id or label
   * @param {string} options.experimentId experiment id
   * @param {string} options.experimentLabel experiment label
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getExperiment(
    { projectId, subjectIdOrLabel, experimentId, experimentLabel },
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (
      experimentId === undefined &&
      (projectId === undefined ||
        (experimentId === undefined && experimentLabel === undefined)) &&
      (projectId === undefined ||
        subjectIdOrLabel === undefined ||
        experimentLabel === undefined)
    ) {
      throw new IllegalArgumentsError(
        `the provided info is not enough to identify an experiment`
      );
    }
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    let path = undefined;
    if (experimentId !== undefined) {
      path = `/data/experiments/${experimentId}`;
    } else if (subjectIdOrLabel !== undefined) {
      path = `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${
        experimentId !== undefined ? experimentId : experimentLabel
      }`;
    } else {
      path = `/data/projects/${projectId}/experiments/${
        experimentId !== undefined ? experimentId : experimentLabel
      }`;
    }
    return this._request('GET', path, { format }, cb);
  }

  /**
   * Get A Single Experiment Record using an experiment id
   * @param {string} experimentId experiment id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getExperimentByExperiment(
    experimentId,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this.getExperiment({ experimentId }, format, cb);
  }

  /**
   * Get A Single Experiment Record using an experiment label
   * @param {string} projectId subject id
   * @param {string} experimentLabel experiment label
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getExperimentByExperimentLabel(
    projectId,
    experimentLabel,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this.getExperiment({ projectId, experimentLabel }, format, cb);
  }

  /**
   * Create A New Experiment
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentLabel experiment label
   * @param {object} json object type project data
   * @param {function} cb optional callback function
   * @returns {string} a simple string of the new experiment's accession ID
   */
  createExperiment(
    projectId,
    subjectIdOrLabel,
    experimentLabel,
    json,
    cb = undefined
  ) {
    if (!json) {
      throw new IllegalArgumentsError(`experiment data is required`);
    }
    if (!json.xsiType) {
      throw new IllegalArgumentsError('xsiType is required');
    }
    const params = queryString.stringify(json);
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentLabel}?${params}`,
      undefined,
      cb,
      CONTENT_TYPES.json
    );
  }

  /**
   * Create a new experiment represented by XML
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentLabel experiment label
   * @param {string} xml project xml representation
   * @param {string} name project name
   * @param {function} cb optional callback function
   * @returns {string} a simple string of the new experiment's accession ID
   */
  createExperimentWithRawXml(
    projectId,
    subjectIdOrLabel,
    experimentLabel,
    xml,
    cb = undefined
  ) {
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentLabel}`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Modify An Experiment Record's Metadata
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {object} json object type project data
   * @param {function} cb optional callback function
   * @returns {string} a simple string of the updated experiment's accession ID
   */
  updateExperiment(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    json,
    cb = undefined
  ) {
    if (!json) {
      throw new IllegalArgumentsError(`experiment data is required`);
    }
    const params = queryString.stringify(json);
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}?${params}`,
      undefined,
      cb,
      CONTENT_TYPES.json
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
   * Share An Experiment Into A New Project
   * @param {string} originalProjectId the ID of the project that owns a given experiment.
   * @param {string} sharedProjectId the ID of the project that you intend an experiment to be shared into
   * @param {string} subjectIdOrLabel subject id or label of the experiment to be shared
   * @param {string} experimentIdOrLabel experiment id or label to be shared
   * @param {string} newLabel Optional. Specify a new label for this experiment that will be used in the shared project, if desired.
   * @param {string} primary Optional. If set to "true", you are changing the primary ownership of the subject from the original project to the new project.
   * @param {function} cb optional callback function
   * @returns {string} the experiment accession ID as a string
   */
  shareExperiment(
    originalProjectId,
    sharedProjectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    newLabel = undefined,
    primary = false,
    cb = undefined
  ) {
    const options = queryString.stringify({ label: newLabel, primary });
    return this._request(
      'PUT',
      `/data/projects/${originalProjectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/projects/${sharedProjectId}?${options}`,
      undefined,
      cb
    );
  }

  /**
   * Get A List Of Shared Projects Associated With An Experiment
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of all projects associated with a subject. The root project ID in the URI can be either a project that owns the subject or a shared project.
   */
  getSharedProjects(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}/projects`,
      {
        format,
      },
      cb
    );
  }

  /**
   * Delete (Or Unshare) A Subject Record
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label to be shared
   * @param {boolean} removeFiles Optional query param. Defaults to "FALSE", which will leave files in the file system after deleting the experiment record in Postgres. When this param is set to "TRUE", those files are permanently deleted.
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteExperiment(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    removeFiles = false,
    cb = undefined
  ) {
    return this._request(
      'DELETE',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
      { removeFiles },
      cb
    );
  }

  /**
   * Delete (Or Unshare) A Subject Record
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label to be shared
   * @param {boolean} removeFiles Optional query param. Defaults to "FALSE", which will leave files in the file system after deleting the experiment record in Postgres. When this param is set to "TRUE", those files are permanently deleted.
   * @param {function} cb optional callback function
   * @returns none
   */
  unshareExperiment(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    cb = undefined
  ) {
    return this.deleteSubject(
      projectId,
      subjectIdOrLabel,
      experimentIdOrLabel,
      false,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Folders Stored With A Subject
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} experimentIdOrLabel experiment id or label
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFolders(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFolders(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
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
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFiles(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFiles(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
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
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   */
  getFile(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).getFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
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
    resourceLabel,
    format = undefined,
    tags = [],
    content = undefined,
    cb = undefined
  ) {
    return Resource.createResource(this).createFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
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
    resourceIdOrLabel,
    filename,
    file,
    overwrite = false,
    cb = undefined
  ) {
    return Resource.createResource(this).uploadFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
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
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {boolean} safe Optional. if throw errors if files exists in the resource folder
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteFolder(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    resourceIdOrLabel,
    safe = false,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
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
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   * @returns none
   */

  deleteFile(
    projectId,
    subjectIdOrLabel,
    experimentIdOrLabel,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/experiments/${experimentIdOrLabel}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }

  /**
   * Check if the code exists in the property of the object
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

export default Experiment;
