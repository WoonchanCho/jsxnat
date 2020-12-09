import UiSpawner from './UiSpawner';
import UiTheme from './UiTheme';

class UiConfig {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  getUiSpawnerApi() {
    return new UiSpawner(this.jsXnat);
  }

  getUiThemeApi() {
    return new UiTheme(this.jsXnat);
  }
}

export default UiConfig;
