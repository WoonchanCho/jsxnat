/**
 * The error structure returned when a request page is not found
 */
export default class NotFoundError extends Error {
  /**
   * Construct a new NotFoundError
   * @param {string} message - an message to return instead of the the default error message
   * @param {string} path - the requested path
   * @param {Object} response - the object returned by fetch
   * @param {string|object} responseData - responseData
   */
  constructor(message, path, responseData, response) {
    super(message);
    this.path = path;
    this.responseData = responseData;
    this.response = (response || {}).response || response;
    this.status = response.status;
  }
}
