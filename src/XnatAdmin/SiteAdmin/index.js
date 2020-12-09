import SiteWideConfig from './SiteWideConfig';
import Preference from './Preference';
import DataTypeSchema from './DataTypeSchema';

class SiteAdmin {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  getSiteConfigApi() {
    return new SiteWideConfig(this.jsXnat);
  }

  getPreferenceApi() {
    return new Preference(this.jsXnat);
  }

  getDataTypeSchemaApi() {
    return new DataTypeSchema(this.jsXnat);
  }
}

export default SiteAdmin;
