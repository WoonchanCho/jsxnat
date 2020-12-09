import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:DicomScp`);

/**
 * the API Wrapper Class for the DicomScp APIs
 */
class DicomScp extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Dicom Scp Definition
   * @typedef {Object} DicomScpDefinition
   * @property {string} aeTitle
   * @property {boolean} enabled
   * @property {string} fileNamer
   * @property {integer} id
   * @property {string} identifier
   * @property {integer} port
   */

  /**
   * Get list of all configured DICOM SCP receiver definitions.
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition[]} DICOM SCP receiver definitions
   */
  getAllDicomScpDefinitions(cb = undefined) {
    return this._request('GET', `/xapi/dicomscp`, undefined, cb);
  }

  /**
   * Creates a new DICOM SCP receiver from the request body.
   * @param {DicomScpDefinition} dicomScpDefinition - DICOM SCP receiver definition
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition[]} DICOM SCP receiver definitions
   */
  createDicomScp(dicomScpDefinition, cb = undefined) {
    return this._request('POST', `/xapi/dicomscp`, dicomScpDefinition, cb);
  }

  /**
   * Get map of all configured DICOM object identifiers and names.
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition[]} DICOM SCP receiver definitions
   */
  getMapOfDicomObjectIdentifiersAndNames(cb = undefined) {
    return this._request('GET', `/xapi/dicomscp/identifiers`, undefined, cb);
  }

  /**
   * Resets all configured DICOM object identifiers.
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition[]} DICOM SCP receiver definitions
   */
  resetAllDicomObjectIdentifers(cb = undefined) {
    return this._request('PUT', `/xapi/dicomscp/identifiers`, undefined, cb);
  }

  /**
   * Starts all enabled DICOM SCP receivers.
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition[]} DICOM SCP receiver definitions
   */
  startAllDicomScpReceivers(cb = undefined) {
    return this._request('PUT', `/xapi/dicomscp/start`, undefined, cb);
  }

  /**
   * Stop all enabled DICOM SCP receivers.
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition[]} DICOM SCP receiver definitions
   */
  startAllDicomScpReceivers(cb = undefined) {
    return this._request('PUT', `/xapi/dicomscp/stop`, undefined, cb);
  }

  /**
   * Gets the DICOM SCP receiver definition with the specified AE title and port.
   * @param {string} title - AE title of the DICOM SCP receiver definition to fetch
   * @param {integer} port - Port of the DICOM SCP receiver definition to fetch
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition} DICOM SCP receiver definitions
   */
  getDicomScpReceiverDefinition(title, port, cb = undefined) {
    return this._request(
      'GET',
      `/xapi/dicomscp/title/${title}/${port}`,
      undefined,
      cb
    );
  }

  /**
   * Gets the DICOM SCP receiver definition with the specified ID.
   * @param {string} id - ID of the DICOM SCP receiver definition to fetch
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition} DICOM SCP receiver definitions
   */
  getDicomScpReceiverDefinitionWithId(id, cb = undefined) {
    return this._request('GET', `/xapi/dicomscp/${id}`, undefined, cb);
  }

  /**
   * Updates the DICOM SCP receiver definition object with the ID specified in the path variable. Note that any ID specified in the serialized definition in the request body is ignored and set to the value from the path variable.
   * @param {string} id - ID of the DICOM SCP receiver definition to fetch
   * @param {DicomScpDefinition} dicomScpDefinition DICOM SCP receiver definitions
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition} DICOM SCP receiver definitions
   */
  updateDicomScpReceiverDefinitionWithId(
    id,
    dicomScpDefinition,
    cb = undefined
  ) {
    return this._request('PUT', `/xapi/dicomscp/${id}`, dicomScpDefinition, cb);
  }

  /**
   * Deletes the DICOM SCP receiver definition object with the specified ID.
   * @param {string} id - ID of the DICOM SCP receiver definition to fetch
   * @param {function} [cb] - Callback function
   * @returns {DicomScpDefinition} DICOM SCP receiver definitions
   */
  getDicomScpReceiverDefinitionWithId(id, cb = undefined) {
    return this._request('DELETE', `/xapi/dicomscp/${id}`, undefined, cb);
  }

  /**
   * Returns whether the DICOM SCP receiver definition with the specified ID is enabled.
   * @param {string} id - ID of the DICOM SCP receiver definition to fetch
   * @param {function} [cb] - Callback function
   * @returns {boolean} whether the DICOM SCP receiver definition with the specified ID is enabled.
   */
  isDicomScpReceiverDefinition(id, cb = undefined) {
    return this._request('GET', `/xapi/dicomscp/${id}/enabled`, undefined, cb);
  }

  /**
   * /xapi/dicomscp/{id}/enabled/{flag}
   * @param {string} id - ID of the DICOM SCP receiver definition to fetch
   * @param {function} [cb] - Callback function
   * @returns none
   */
  enableDisableDicomScpReceiverDefinition(id, flag, cb = undefined) {
    return this._request(
      'PUT',
      `/xapi/dicomscp/${id}/enabled/${flag}`,
      undefined,
      cb
    );
  }
}

export default DicomScp;
