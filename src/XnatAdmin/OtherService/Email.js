import queryString from 'query-string';
import debug from 'debug';
import { APP_NAME, CONTENT_TYPES } from '../../Common/Constant';
import Requestable from '../../Common/Requestable';
import { IllegalArgumentsError } from '../../Error';

const log = debug(`${APP_NAME}:Email`);

/**
 * the API Wrapper Class for the Email APIs
 */
class Email extends Requestable {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    super(jsXnat);
  }

  /**
   * Send Email From XNAT To User
   * @param {string} to - an email account that matches a user account in XNAT
   * @param {string} subject - an email subject
   * @param {string} [text] - a plain-text version of your email body copy.
   * @param {string} [html] - an HTML-formatted version of your email body copy.
   * @param {function} [cb] - Callback function
   * @returns {string} Result message
   */
  send(to, subject, text, html, cb = undefined) {
    if (!to) {
      throw new IllegalArgumentsError('to is required');
    }
    if (!subject) {
      throw new IllegalArgumentsError('subject is required');
    }
    return this._request(
      'POST',
      `/data/services/mail/send`,
      { to, subject, text, html },
      cb,
      CONTENT_TYPES.form
    );
  }

  /**
   * Send Or Resend Email Verification To User
   * @param {string} email - an email account that matches a user account in XNAT
   * @param {function} [cb] - Callback function
   * @return none
   */
  sendVerification(email, cb = undefined) {
    return this._request(
      'POST',
      `/data/services/sendEmailVerification?${queryString.stringify({
        email,
      })}`,
      undefined,
      cb
    );
  }
}

export default Email;
