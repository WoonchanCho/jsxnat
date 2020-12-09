import Plugin from './Plugin';

export default class PluginAdmin {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  getPluginApi() {
    return new Plugin(this.jsXnat);
  }
}
