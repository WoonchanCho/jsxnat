import debug from 'debug';
import { APP_NAME } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:DataTypeSchema`);

/**
 * Schema Api
 */
class DataTypeSchema extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Returns a list of all of the installed XNAT data-type schemas.
   * @param {function | undefined} cb optional callback function
   */
  getAllSchemas(cb = undefined) {
    return this._request('GET', '/xapi/schemas', undefined, cb);
  }

  /**
   * Returns the requested XNAT data-type schema.
   * @param {string} schema schema
   * @param {string | undefined} namespace namespace (this is optional because it can be possible for a schema to be in the root namespace)
   * @param {function | undefined} cb optional callback function
   */
  getSchema(schema, namespace = undefined, cb = undefined) {
    if (schema === undefined) {
      throw new IllegalArgumentsError('schema is required');
    }
    const path =
      namespace === undefined
        ? `/xapi/schemas/${schema}`
        : `/xapi/schemas/${namespace}/${schema}`;
    return this._request('GET', path, undefined, cb);
  }

  /**
   * Gets a list of the available data types on the system.
   * @param {function | undefined} cb optional callback function
   */
  setDataType(json, cb = undefined) {
    if (json === undefined || typeof json !== 'object') {
      throw new IllegalArgumentsError('illegal json entered');
    }
    return this._request(
      'POST',
      '/xapi/schemas/datatypes/elements',
      undefined,
      cb
    );
  }

  /**
   * Gets information about the requested data type.
   * @param {string} dataTypeName the name of the data type to show
   * @param {function | undefined} cb optional callback function
   */
  getDataTypeInfo(dataTypeName, cb = undefined) {
    if (dataTypeName === undefined) {
      throw new IllegalArgumentsError('dataTypeName is required');
    }
    return this._request(
      'GET',
      `/xapi/schemas/datatypes/elements/${dataTypeName}`,
      undefined,
      cb
    );
  }

  /**
   * Gets a map of all available data types on the system with the full element definition.
   * @param {function | undefined} cb optional callback function
   */
  getAllDataTypeInfo(cb = undefined) {
    return this._request(
      'GET',
      `/xapi/schemas/datatypes/elements/all`,
      undefined,
      cb
    );
  }

  /**
   * Gets information about the requested data type.
   * @param {string | array} dataTypeNames data type names
   * @param {function | undefined} cb optional callback function
   */
  getDataTypeNames(dataTypeNames, cb = undefined) {
    if (dataTypeNames === undefined) {
      throw new IllegalArgumentsError('dataTypeNames are required');
    }
    return this._request(
      'POST',
      `/xapi/schemas/datatypes/names`,
      {
        dataTypes: Array.isArray(dataTypeNames)
          ? dataTypeNames
          : [dataTypeNames],
      },
      cb
    );
  }

  /**
   * Gets the element names and types for the specified data type.
   * @param {string} dataTypeName data type name
   * @param {function | undefined} cb optional callback function
   */
  getDataTypeName(dataTypeName, cb = undefined) {
    return this.getDataTypeNames(dataTypeName, cb);
  }

  /**
   * Gets a map of the available data types on the system along with the various data type element names and types.
   * @param {function | undefined} cb optional callback function
   */
  getAllDataTypeNames(cb = undefined) {
    return this._request(
      'GET',
      `/xapi/schemas/datatypes/names/all`,
      undefined,
      cb
    );
  }
}

export default DataTypeSchema;
