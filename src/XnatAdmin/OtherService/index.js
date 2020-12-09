import FileMover from './FileMover';
import Email from './Email';
import Audit from './Audit';
import CatalogRefresh from './CatalogRefresh';

/**
 * the Aggregate class of the API Wrappers for miscellaneous jobs
 */
class OtherService {
  constructor(jsXnat) {
    this.jsXnat = jsXnat;
  }

  /**
   * Get the File Mover API wrapper class
   * @returns {FileMover} the File Mover API wrapper class
   */
  getFileMoverApi() {
    return new FileMover(this.jsXnat);
  }

  /**
   * Get the Email API wrapper class
   * @returns {Email} the Email API wrapper class
   */
  getEmailApi() {
    return new Email(this.jsXnat);
  }

  /**
   * Get the Audit API wrapper class
   * @returns {Audit} the Audit API wrapper class
   */
  getAuditApi() {
    return new Audit(this.jsXnat);
  }

  /**
   * Get the Catalog Refresh API wrapper class
   * @returns {CatalogRefresh} the Catalog Refresh API wrapper class
   */
  getCatalogRefreshApi() {
    return new CatalogRefresh(this.jsXnat);
  }
}

export default OtherService;
