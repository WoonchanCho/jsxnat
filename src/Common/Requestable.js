import 'isomorphic-form-data';
import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES } from './Constant';
import {
  ResponseError,
  AuthorizationError,
  NotFoundError,
  BadRequestError,
  ConflictError,
  IllegalArgumentsError,
} from '../Error';

const log = debug(`${APP_NAME}:Requestable`);
/**
 * Requestable wraps the logic for making http requests to the API
 */
class Requestable {
  /**
   * Initialize the http internals.
   * @param {Requestable.auth} [auth] - the credentials to authenticate to Xnat. If auth is
   *                                  not provided request will be made unauthenticated
   * @param {string} [apiBase] - the base Xnat URL
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
    // this.__apiBase = cleanseUrl(apiBase);
    // this.__auth = {
    //   token: auth.token,
    //   username: auth.username,
    //   password: auth.password,
    // };

    // if (auth.token) {
    //   this.__authorizationHeader = 'token ' + auth.token;
    // } else if (auth.username && auth.password) {
    //   this.__authorizationHeader =
    //     'Basic ' + Base64.encode(auth.username + ':' + auth.password);
    // }
  }

  /**
   * Compute the URL to use to make a request.
   * @private
   * @param {string} path - either a URL relative to the API base or an absolute URL
   * @return {string} - the URL to use
   */
  __getURL(path) {
    let url = path;
    if (path.indexOf('//') === -1) {
      url = this.jsXnat.basePath + path;
    }

    const newCacheBuster = 'timestamp=' + new Date().getTime();
    return url.replace(/(timestamp=\d+)/, newCacheBuster);
  }

  /**
   * Compute the headers required for an API request.
   * @private
   * @return {Object} - the headers to use in the request
   */
  async __getRequestHeaders(requiredAuthMethod) {
    const headers = {};

    headers.Authorization = await this.jsXnat.getAuthorizationHeader(
      requiredAuthMethod
    );

    return headers;
  }

  /**
   * Sets the default options for API requests
   * @protected
   * @param {Object} [requestOptions={}] - the current options for the request
   * @return {Object} - the options to pass to the request
   */
  _getOptionsWithDefaults(requestOptions = {}) {
    if (!(requestOptions.visibility || requestOptions.affiliation)) {
      requestOptions.type = requestOptions.type || 'all';
    }
    requestOptions.sort = requestOptions.sort || 'updated';
    requestOptions.per_page = requestOptions.per_page || '100'; // eslint-disable-line

    return requestOptions;
  }

  /**
   * A function that receives the result of the API request.
   * @callback Requestable.callback
   * @param {Requestable.Error} error - the error returned by the API or `null`
   * @param {(Object|true)} result - the data returned by the API or `true` if the API returns `204 No Content`
   * @param {Object} request - the raw {@linkcode https://github.com/mzabriskie/axios#response-schema Response}
   */
  /**
   * Make a request.
   * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
   * @param {string} path - the path for the request
   * @param {*} [bodyParams] - the data to send to the server. For HTTP methods that don't have a body the data
   *                   will be sent as query parameters
   * @param {Requestable.callback} [cb] - the callback for the request
   * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
   *                              request will be made as JSON
   * @return {Promise} - the Promise for the http request
   */
  async _request(
    method,
    path,
    bodyParams,
    cb,
    contentType = CONTENT_TYPES.json,
    requiredAuthMethod = undefined
  ) {
    let url = this.__getURL(path);
    const headers = await this.__getRequestHeaders(requiredAuthMethod);
    let queryParams = {};
    let shouldUseDataAsQueryString = false;
    let body = undefined;

    if (bodyParams) {
      shouldUseDataAsQueryString =
        typeof bodyParams === 'object' && methodHasNoBody(method);
      if (shouldUseDataAsQueryString) {
        queryParams = bodyParams;
        bodyParams = undefined;
      }
    }
    if (contentType === CONTENT_TYPES.json) {
      headers['Content-Type'] = contentType;
      body = JSON.stringify(bodyParams);
    } else if (
      contentType === CONTENT_TYPES.binary ||
      contentType === CONTENT_TYPES.xml ||
      contentType === CONTENT_TYPES.plain
    ) {
      headers['Content-Type'] = contentType;
      body = bodyParams;
    } else if (contentType === CONTENT_TYPES.form) {
      headers['Content-Type'] = contentType;
      if (bodyParams instanceof URLSearchParams) {
        body = bodyParams;
      } else {
        const urlParams = new URLSearchParams();
        Object.keys(bodyParams).forEach((key) => {
          urlParams.append(key, bodyParams[key]);
        });
        body = urlParams;
      }
    } else if (contentType === CONTENT_TYPES.multipart) {
      // Content-Type for multipart form type will be automtically popuplated by note-fetch (along with the boundary parameter)
      if (bodyParams instanceof FormData) {
        body = bodyParams;
      } else {
        const formData = new FormData();
        Object.keys(bodyParams).forEach((key) => {
          formData.append(key, bodyParams[key]);
        });
        body = formData;
      }
    } else {
      throw new IllegalArgumentsError(
        `Content Type is not valid: ${contentType}`
      );
    }

    const config = {
      method: method,
      headers: headers,
      body,
      // body: typeof data === 'object' ? JSON.stringify(data) : data,
    };
    if (Object.keys(queryParams).length > 0) {
      url = `${url}?${queryString.stringify(queryParams)}`;
    }
    log(`${config.method} to ${url}`);
    let responseData;
    try {
      const response = await fetch(url, config);
      responseData = await getResponseData(response);
      if (!response.ok) {
        throwErrorBasedOnStatus(path, responseData, response);
      }
      if (cb) cb(null, responseData, response);
    } catch (err) {
      callbackErrorOrThrow(cb, path, err);
    }
    return responseData;
  }

  /**
   * Make a request to an endpoint the returns 204 when true and 404 when false
   * @param {string} path - the path to request
   * @param {Object} data - any query parameters for the request
   * @param {Requestable.callback} cb - the callback that will receive `true` or `false`
   * @param {method} [method=GET] - HTTP Method to use
   * @return {Promise} - the promise for the http request
   */
  _request204or404(path, data, cb, method = 'GET') {
    return this._request(method, path, data).then(
      function success(response) {
        if (cb) {
          cb(null, true, response);
        }
        return true;
      },
      function failure(response) {
        if (response.response.status === 404) {
          if (cb) {
            cb(null, false, response);
          }
          return false;
        }

        if (cb) {
          cb(response);
        }
        throw response;
      }
    );
  }
}

export default Requestable;

// ////////////////////////// //
//  Private helper functions  //
// ////////////////////////// //
const METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];
/**
 * check if the http method provided has a body part
 * @param {string} method - upper-case http method name
 * @return {boolean} - has body
 */
function methodHasNoBody(method) {
  return METHODS_WITH_NO_BODY.indexOf(method) !== -1;
}

/**
 * ??
 * @param {string} linksHeader - linksHeader separated by comma
 * @return {string} - nextUrl
 */
function getNextPage(linksHeader = '') {
  const links = linksHeader.split(/\s*,\s*/); // splits and strips the urls
  return links.reduce(function (nextUrl, link) {
    if (link.search(/rel="next"/) !== -1) {
      return (link.match(/<(.*)>/) || [])[1];
    }

    return nextUrl;
  }, undefined);
}

/**
 * Callback or throw
 * @param {function} cb - callback function
 * @param {string} path - api path
 * @return {void}
 */
function callbackErrorOrThrow(cb, path, object) {
  let error;
  if (Object.prototype.hasOwnProperty.call(object, 'config')) {
    const { status, statusText, url } = object;
    const message = `${status} error making request to ${url}: "${statusText}"`;
    error = new ResponseError(message, path, object);
    log(`${message} ${JSON.stringify(object.data)}`);
  } else {
    error = object;
  }
  if (cb) {
    log('Calling the callback function provided', cb.name);
    cb(error);
  } else {
    log('Throwing error');
    throw error;
  }
}

function getResponseContentType(response) {
  const contentType = response.headers.get('content-type');
  return contentType ? contentType.split(';')[0].trim() : undefined;
}

async function getResponseData(response) {
  const contentType = getResponseContentType(response);
  log('response content-type', contentType);
  let responseData = undefined;
  if (contentType === 'application/json') {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }
  return responseData;
}

function throwErrorBasedOnStatus(path, responseData, response) {
  const status = response.status;

  if (status.ok) {
    return;
  } else if (status === 400) {
    throw new BadRequestError(`Bad Request`, path, responseData, response);
  } else if (status === 401 || status === 403) {
    throw new AuthorizationError(
      `Not authorized to call`,
      path,
      response,
      responseData
    );
  } else if (status === 404) {
    throw new NotFoundError(`Not found`, path, responseData, response);
  } else if (status === 409) {
    throw new ConflictError(`Conflict`, path, responseData, response);
  } else {
    throw new ResponseError(
      `Unknown error happened`,
      path,
      responseData,
      response
    );
  }
}
