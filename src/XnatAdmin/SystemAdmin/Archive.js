import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:Archive`);

/**
 * Catalog Api
 */
class Archive extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  static RefreshOperations = {
    All: 'All',
    Append: 'Append',
    Checksum: 'Checksum',
    Delete: 'Delete',
    PopulateStats: 'PopulateStats',
  };

  //
  // Creates a download catalog for the submitted sessions and other data objects.
  // Retrieves the download catalog for the submitted catalog ID.
  // Downloads the specified catalog as a zip archive, using a small empty file for each entry.
  // Downloads the specified catalog as an XML file.
  // Downloads the contents of the specified catalog as a zip archive.

  // Accepts the XML payload and attempts to create or update an XNAT data object as appropriate.
  // Accepts the XML payload and attempts to create or update an XNAT data object as appropriate.

  /**
   * Refresh the catalog entry for one or more resources.
   * @param {array | string} resources the list of resources (or a single resource: '/archive/experiments/XNAT_E00001') to be refreshed
   * @param {function | undefined} cb optional callback function
   */
  refreshCatalog(resources, cb = undefined) {
    if (!resources) {
      throw new IllegalArgumentsError('resources are required');
    }
    return this._request(
      'PUT',
      '/xapi/archive/catalogs/refresh',
      Array.isArray(resources) ? resources : [resources],
      cb
    );
  }

  /**
   * Refresh the catalog entry for one or more resources, performing only the operations specified.
   * @param {array | string} operations The operations to be performed
   * @param {array | string} resources the list of resources (or a single resource: '/archive/experiments/XNAT_E00001') to be refreshed
   * @param {function | undefined} cb optional callback function
   */
  refreshCatalogWithSpecificOperation(operations, resources, cb = undefined) {
    operations = Array.isArray(operations) ? operations : [operations];
    if (operations.find((operation) => !Archive.RefreshOperations[operation])) {
      throw new IllegalArgumentsError(
        `There is an operation that is not supported in the requested operations: ${operations}`
      );
    }

    return this._request(
      'PUT',
      `/xapi/archive/catalogs/refresh/${operations.join(',')}`,
      Array.isArray(resources) ? resources : [resources],
      cb
    );
  }

  /**
   * Creates a download catalog for the submitted sessions and other data objects.
   * @param {object} resources The resources to be cataloged.
   */
  download(resources, cb = undefined) {
    if (!resources) {
      throw new IllegalArgumentsError('resources are required');
    }
    return this._request('POST', '/xapi/archive/download', resources, cb);
  }

  /**
   * Creates a download catalog for the submitted sessions and other data objects.
   * @param {object} resources The resources to be cataloged.
   */
  downloadWithSize(resources, cb = undefined) {
    if (!resources) {
      throw new IllegalArgumentsError('resources are required');
    }
    return this._request(
      'POST',
      '/xapi/archive/downloadwithsize',
      resources,
      cb
    );
  }

  /**
   * Returns preferences for matched tool id
   * @param {string} toolId toolId
   * @param {string} returnFormat return format (either json or ini)
   * @param {function | undefined} cb optional callback function
   */
  getPreferences(toolId, returnFormat = 'json', cb = undefined) {
    if (toolId === undefined) {
      throw new IllegalArgumentsError('toolId is required');
    }
    if (returnFormat !== 'json' && returnFormat !== 'ini') {
      throw new IllegalArgumentsError(`Invalid format: ${returnFormat}`);
    }
    const path =
      '/xapi/prefs' + (returnFormat === 'json' ? '/props/' : '/ini/') + toolId;
    return this._request('GET', path, undefined, cb);
  }

  /**
   * Returns a single preference and value for this XNAT application.
   * @param {string} toolId toolId
   * @param {string} preference a single preference
   * @param {function | undefined} cb optional callback function
   */
  getPreference(toolId, preference, cb = undefined) {
    if (toolId === undefined) {
      throw new IllegalArgumentsError('toolId is required');
    }
    if (preference === undefined) {
      throw new IllegalArgumentsError('preference is required');
    }
    return this._request(
      'GET',
      `/xapi/prefs/props/${toolId}/${preference}`,
      undefined,
      cb
    );
  }

  /**
   * Set a value for a single preference
   * @param {string} toolId toolId
   * @param {string} preference a single preference
   * @param {function | undefined} cb optional callback function
   */
  setPreference(toolId, preference, value, cb = undefined) {
    if (toolId === undefined) {
      throw new IllegalArgumentsError('toolId is required');
    }
    if (preference === undefined) {
      throw new IllegalArgumentsError('preference is required');
    }
    if (value === undefined) {
      throw new IllegalArgumentsError('value is required');
    }
    return this._request(
      'PUT',
      `/xapi/prefs/props/${toolId}/${preference}`,
      value,
      cb
    );
  }
}

export default Archive;
