import Plugin from './Plugin';

class PluginAdmin {
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

export default PluginAdmin;
