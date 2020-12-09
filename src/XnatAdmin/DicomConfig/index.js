import DicomScp from './DicomScp';
import Anonymization from './Anonymization';

class DicomConfig {
  /**
   * Constructor
   * @param {JsXnat} jsXnat
   */
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  getDicomScpApi() {
    return new DicomScp(this.jsXnat);
  }

  getAnonymizationApi() {
    return new Anonymization(this.jsXnat);
  }
}

export default DicomConfig;
