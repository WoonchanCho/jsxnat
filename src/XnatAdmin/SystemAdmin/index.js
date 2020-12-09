import Archive from './Archive';
import Notification from './Notification';
import Task from './Task';

export default class SystemAdmin {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  getArchiveApi() {
    return new Archive(this.jsXnat);
  }

  getNotificationApi() {
    return new Notification(this.jsXnat);
  }

  getTaskApi() {
    return new Task(this.jsXnat);
  }
}
