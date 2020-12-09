import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES, RESPONSE_FORMAT } from '../Common/Constant';
import Requestable from '../Common/Requestable';
import XmlParser from '../Common/XmlParser';
import { IllegalArgumentsError } from '../Error';
import Resource from './Resource';

const log = debug(`${APP_NAME}:Subject`);

/**
 * Wrapper class for the Subject related APIs
 */
class Subject extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Subject Xml Path Shortcuts objects
   */
  static SubjectXmlPathShortcuts = {
    insert_date: 'insert_date',
    insert_user: 'insert_user',
    project: 'project',
    label: 'label',
    age: 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/age',
    birth_weight:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/birth_weight',
    dob: 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/dob',
    education:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/education',
    educationDesc:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/educationDesc',
    ethnicity:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/ethnicity',
    gender:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/gender',
    gestational_age:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/gestational_age',
    group: 'xnat:subjectData/group',
    handedness:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/handedness',
    height:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/height',
    insert_date: 'xnat:subjectData/meta/insert_date',
    insert_user: 'xnat:subjectData/meta/insert_user',
    last_modified: 'xnat:subjectData/meta/last_modified',
    pi_firstname: 'xnat:subjectData/investigator/firstname',
    pi_lastname: 'xnat:subjectData/investigator/lastname',
    post_menstrual_age:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/post_menstrual_age',
    race: 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/race',
    ses: 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/ses',
    src: 'xnat:subjectData/src',
    weight:
      'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/weight',
    yob: 'xnat:subjectData/demographics[@xsi:type=xnat:demographicData]/yob',
  };

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

  /**
   * Get a listing of all subjects
   * @param {string | array} columns Optional. Column names can be either properties of SubjectXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Subject+Data+REST+XML+Path+Shortcuts
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getAllSubjects(columns = [], format = RESPONSE_FORMAT.json, cb = undefined) {
    return this._request(
      'GET',
      `/data/subjects`,
      {
        columns: this.__convertSubjectColumns(columns),
        format,
      },
      cb
    );
  }

  /**
   * Get a listing of all subjects
   * @param {string} projectId project id
   * @param {string | array} columns Optional. Column names can be either properties of SubjectXmlPathShortcuts or XML Path Shortcuts: https://wiki.xnat.org/display/XAPI/Subject+Data+REST+XML+Path+Shortcuts
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getSubjects(
    projectId,
    columns = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this._request(
      'GET',
      `/data/projects/${projectId}/subjects`,
      {
        columns: this.__convertSubjectColumns(columns),
        format,
      },
      cb
    );
  }

  /**
   * Get a single subject
   * @param {string} options.projectId project id
   * @param {string} options.subjectId subject id
   * @param {string} options.subjectLabel subject label
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getSubject(
    { projectId, subjectId, subjectLabel },
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (
      subjectId === undefined &&
      (projectId === undefined || subjectLabel === undefined)
    ) {
      throw new IllegalArgumentsError(
        `subject id or a combination of project id and subject label is required`
      );
    }
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    const path =
      subjectId !== undefined
        ? `/data/subjects/${subjectId}`
        : `/data/projects/${projectId}/subjects/${subjectLabel}`;
    return this._request('GET', path, { format }, cb);
  }

  /**
   * Get a single subject by a project id and a subject label
   * @param {string} projectId project id
   * @param {string} subjectLabel subject label
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getSubjectBySubjectLabel(
    projectId,
    subjectLabel,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this.getSubject({ projectId, subjectLabel }, format, cb);
  }

  /**
   * Get a single subject by a project id and subject label
   * @param {string} subjectId subject id
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  getSubjectBySubjectId(
    subjectId,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return this.getSubject({ subjectId }, format, cb);
  }

  /**
   * Create an empty subject
   * @param {string} projectId project id
   * @param {string} subjectLabel subject label
   * @param {function} cb optional callback function
   */
  createSimpleSubject(projectId, subjectLabel, cb = undefined) {
    if (subjectLabel === undefined) {
      throw new IllegalArgumentsError(`subject label is required`);
    }
    return this.createSubject(
      projectId,
      subjectLabel,
      {
        _attrs: {
          project: projectId,
          label: subjectLabel,
        },
      },
      cb
    );
  }

  /**
   * Create a subject
   * @param {string} projectId project id
   * @param {string} subjectLabel subject label
   * @param {object} json object type project data
   * @param {function} cb optional callback function
   */
  createSubject(projectId, subjectLabel, json, cb = undefined) {
    if (!json) {
      throw new IllegalArgumentsError(`subject data is required`);
    }
    if (!json._attrs) {
      json._attrs = {};
    }
    json._attrs.project = projectId;
    json._attrs.label = subjectLabel;

    return this.createSubjectWithRawXml(
      projectId,
      subjectLabel,
      new XmlParser().convertFromJsonToXml('Subject', json),
      cb
    );
  }

  /**
   * Create a project represented by XML
   * @param {string} projectId project id
   * @param {string} xml project xml representation
   * @param {string} name project name
   * @param {function} cb optional callback function
   * @returns new subject's XNAT accession ID e.g., XNAT_S00036
   */
  createSubjectWithRawXml(projectId, subjectLabel, xml, cb = undefined) {
    return this._request(
      'PUT',
      `/data/projects/${projectId}/subjects/${subjectLabel}`,
      xml,
      cb,
      CONTENT_TYPES.xml
    );
  }

  /**
   * Update a subject by subject label
   * @param {string} options.projectId project id
   * @param {string} options.subjectLabel subject label
   * @param {object} json object type project data
   * @param {function} cb optional callback function
   */
  updateSubjectBySubjectLabel(projectId, subjectLabel, json, cb = undefined) {
    if (!json) {
      throw new IllegalArgumentsError(`subject data is required`);
    }

    return this.updateSubjectWithRawXml(
      { projectId, subjectLabel },
      new XmlParser().convertFromJsonToXml('Project', json),
      cb
    );
  }

  /**
   * Update a subject
   * @param {string} subjectId subject id
   * @param {object} json object type project data
   * @param {function} cb optional callback function
   */
  updateSubject(subjectId, json, cb = undefined) {
    if (!json) {
      throw new IllegalArgumentsError(`subject data is required`);
    }

    return this.updateSubjectWithRawXml(
      { subjectId },
      new XmlParser().convertFromJsonToXml('Project', json),
      cb
    );
  }

  /**
   * Update a subject represented by XML
   * @param {string} options.projectId project id
   * @param {string} options.subjectId subject id
   * @param {string} options.subjectLabel subject label
   * @param {string} xml project xml representation
   * @param {function} cb optional callback function
   */
  updateSubjectWithRawXml(
    { projectId, subjectId, subjectLabel },
    xml,
    cb = undefined
  ) {
    if (
      subjectId === undefined &&
      (projectId === undefined || subjectLabel === undefined)
    ) {
      throw new IllegalArgumentsError(
        `subject id or a combination of project id and subject label is required`
      );
    }
    const path =
      subjectId !== undefined
        ? `/data/subjects/${subjectId}`
        : `/data/projects/${projectId}/subjects/${subjectLabel}`;
    return this._request('PUT', path, xml, cb, CONTENT_TYPES.xml);
  }

  /**
   * Share A Subject Into A New Project
   * @param {string} originalProjectId the ID of the project that owns a given subject.
   * @param {string} sharedProjectId the ID of the project that you intend a subject to be shared into
   * @param {string} subjectIdOrLabel subject id or label to be shared
   * @param {string} newLabel Optional. Specify a new label for this subject that will be used in the shared project, if desired.
   * @param {string} primary Optional. If set to "true", you are changing the primary ownership of the subject from the original project to the new project.
   * @param {string} format Optional. Set the format of the response. json by default
   * @param {function} cb optional callback function
   */
  shareSubject(
    originalProjectId,
    sharedProjectId,
    subjectIdOrLabel,
    newLabel = undefined,
    primary = false,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    const options = queryString.stringify({ label: newLabel, primary, format });
    return this._request(
      'PUT',
      `/data/projects/${originalProjectId}/subjects/${subjectIdOrLabel}/projects/${sharedProjectId}?${options}`,
      undefined,
      cb
    );
  }

  /**
   * Get A List Of Shared Projects Associated With A Subject
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject label
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   * @returns a list of all projects associated with a subject. The root project ID in the URI can be either a project that owns the subject or a shared project.
   */
  getSharedProjects(
    projectId,
    subjectIdOrLabel,
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    if (!RESPONSE_FORMAT[format]) {
      format = RESPONSE_FORMAT.json;
    }
    return this._request(
      'GET',
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}/projects`,
      {
        format,
      },
      cb
    );
  }

  /**
   * Delete (Or Unshare) A Subject Record
   * @param {string} projectId project id
   * @param {string} subjectLabel subject label
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteSubject(projectId, subjectLabel, cb = undefined) {
    return this._request(
      'DELETE',
      `/data/projects/${projectId}/subjects/${subjectLabel}`,
      undefined,
      cb
    );
  }

  /**
   * Delete (Or Unshare) A Subject Record
   * @param {string} projectId project id
   * @param {string} subjectLabel subject label
   * @param {function} cb optional callback function
   * @returns none
   */
  unshareSubject(projectId, subjectLabel, cb = undefined) {
    return this.deleteSubject(projectId, subjectLabel, cb);
  }

  /**
   * Get A Listing Of Resource Folders Stored With A Subject
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFolders(
    projectId,
    subjectIdOrLabel,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFolders(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Project
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {array | string} sortBy Optional. Sort the returned results by one or more parameters in the Result array. Multiple parameters can be provided
   * @param {string} format Optional. Set the format of the response. Format value can be json, html, xml, or csv. If not specified, default is JSON
   * @param {function} cb optional callback function
   */
  getFiles(
    projectId,
    subjectIdOrLabel,
    sortBy = [],
    format = RESPONSE_FORMAT.json,
    cb = undefined
  ) {
    return Resource.createResource(this).getFiles(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}`,
      sortBy,
      format,
      cb
    );
  }

  /**
   * Get A Listing Of Resource Files Stored With A Project
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   */
  getFile(
    projectId,
    subjectIdOrLabel,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).getFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }

  /**
   * Create A New Project Resource Folder
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
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
    resourceLabel,
    format = undefined,
    tags = [],
    content = undefined,
    cb = undefined
  ) {
    return Resource.createResource(this).createFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}`,
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
    resourceIdOrLabel,
    filename,
    file,
    overwrite = false,
    cb = undefined
  ) {
    return Resource.createResource(this).uploadFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}`,
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
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {boolean} safe Optional. if throw errors if files exists in the resource folder
   * @param {function} cb optional callback function
   * @returns none
   */
  deleteFolder(
    projectId,
    subjectIdOrLabel,
    resourceIdOrLabel,
    safe = false,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFolder(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}`,
      resourceIdOrLabel,
      safe,
      cb
    );
  }

  /**
   * Delete A Project Resource File
   * @param {string} projectId project id
   * @param {string} subjectIdOrLabel subject id or label
   * @param {string} resourceIdOrLabel resource id or label (folder name)
   * @param {string} filename filename
   * @param {function} cb optional callback function
   * @returns none
   */

  deleteFile(
    projectId,
    subjectIdOrLabel,
    resourceIdOrLabel,
    filename,
    cb = undefined
  ) {
    return Resource.createResource(this).deleteFile(
      `/data/projects/${projectId}/subjects/${subjectIdOrLabel}`,
      resourceIdOrLabel,
      filename,
      cb
    );
  }
}

export default Subject;
