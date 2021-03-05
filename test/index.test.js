import { Base64 } from 'js-base64';
import JsXnat from '../src/index';
import { expect } from 'chai';
import { AUTH_METHODS } from '../src/Common/Constant';
import { IllegalArgumentsError } from '../src/Error';

import SiteAdmin from '../src/XnatAdmin/SiteAdmin';
import SystemAdmin from '../src/XnatAdmin/SystemAdmin';
import UserAdmin from '../src/XnatAdmin/UserAdmin';
import UserAuth from '../src/XnatAdmin/UserAuth';
import PluginAdmin from '../src/XnatAdmin/PluginAdmin';
import UiConfig from '../src/XnatAdmin/UiConfig';
import DicomConfig from '../src/XnatAdmin/DicomConfig';
import OtherService from '../src/XnatAdmin/OtherService';
import Project from '../src/XnatDataMgmt/Project';
import Subject from '../src/XnatDataMgmt/Subject';
import Experiment from '../src/XnatDataMgmt/Experiment';
import Scan from '../src/XnatDataMgmt/Scan';
import ImageAssessor from '../src/XnatDataMgmt/ImageAssessor';
import Resource from '../src/XnatDataMgmt/Resource';
import Archive from '../src/XnatDataMgmt/Archive';
import Search from '../src/XnatDataMgmt/Search';
import DataProcessing from '../src/XnatDataMgmt/DataProcessing';
import Automation from '../src/XnatDataMgmt/Automation';
import Prearchive from '../src/XnatDataMgmt/Prearchive';
import DicomDump from '../src/XnatDataMgmt/DicomDump';
import Workflow from '../src/XnatDataMgmt/Workflow';

const TEST_XNAT_URL = 'http://localhost:8081';
const TEST_USERNAME = 'admin';
const TEST_PASSWORD = 'admin';
describe('JsXnat', function () {
  describe('constructor', function () {
    it('should have a basepath', function () {
      expect(() => new JsXnat(AUTH_METHODS.noAuth)).to.throw(
        IllegalArgumentsError
      );

      expect(() => new JsXnat(AUTH_METHODS.noAuth, '/')).not.to.throw();
    });

    it('should have a username and password when the auth method is password or token', function () {
      expect(() => new JsXnat(AUTH_METHODS.password, '/')).to.throw(
        IllegalArgumentsError
      );

      expect(() => new JsXnat(AUTH_METHODS.token, '/')).to.throw(
        IllegalArgumentsError
      );

      expect(() => new JsXnat(AUTH_METHODS.noAuth, '/')).not.to.throw();
    });
  });

  //   describe('getVersion()', function () {
  //     it('should retrieve a XNAT version', async function () {
  //       const jsXnat = new JsXnat(AUTH_METHODS.password, TEST_XNAT_URL, {
  //         username: TEST_USERNAME,
  //         password: TEST_PASSWORD,
  //       });

  //       let version = await jsXnat.getVersion();
  //       expect(version).to.equal('version 1.7.6');

  //       version = await jsXnat.getVersion(true);
  //       expect(version).to.equal('version 1.7.6, build: 1694');
  //     });
  //   });

  describe('getAuthorizationHeader()', function () {
    it('should return empty string when the auth method is noAuth', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');

      const authHeader = await jsXnat.getAuthorizationHeader();
      expect(authHeader).to.equal('');
    });

    it('should return Basic auth header when the auth method is password', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.password, TEST_XNAT_URL, {
        username: TEST_USERNAME,
        password: TEST_PASSWORD,
      });

      const authHeader = await jsXnat.getAuthorizationHeader();
      expect(authHeader).to.equal(
        `Basic ${Base64.encode(TEST_USERNAME + ':' + TEST_PASSWORD)}`
      );
    });
  });

  describe('JsXnat object', function () {
    it('should return getSiteAdmin', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getSiteAdmin()).to.instanceOf(SiteAdmin);
    });

    it('should return getSystemAdmin', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getSystemAdmin()).to.instanceOf(SystemAdmin);
    });

    it('should return getUserAdmin', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getUserAdmin()).to.instanceOf(UserAdmin);
    });

    it('should return getUserAuth', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getUserAuth()).to.instanceOf(UserAuth);
    });

    it('should return getPluginAdmin', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getPluginAdmin()).to.instanceOf(PluginAdmin);
    });

    it('should return getUiConfig', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getUiConfig()).to.instanceOf(UiConfig);
    });

    it('should return getDicomConfig', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getDicomConfig()).to.instanceOf(DicomConfig);
    });

    it('should return getOtherService', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getOtherService()).to.instanceOf(OtherService);
    });

    it('should return getProjectApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getProjectApi()).to.instanceOf(Project);
    });

    it('should return getSubjectApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getSubjectApi()).to.instanceOf(Subject);
    });

    it('should return getExperimentApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getExperimentApi()).to.instanceOf(Experiment);
    });

    it('should return getScanApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getScanApi()).to.instanceOf(Scan);
    });

    it('should return getImageAssessorApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getImageAssessorApi()).to.instanceOf(ImageAssessor);
    });

    it('should return getResourceApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getResourceApi()).to.instanceOf(Resource);
    });

    it('should return getArchiveApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getArchiveApi()).to.instanceOf(Archive);
    });

    it('should return getPrearchiveApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getPrearchiveApi()).to.instanceOf(Prearchive);
    });

    it('should return getSearchApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getSearchApi()).to.instanceOf(Search);
    });

    it('should return getDataProcessingApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getDataProcessingApi()).to.instanceOf(DataProcessing);
    });

    it('should return getAutomationApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getAutomationApi()).to.instanceOf(Automation);
    });

    it('should return getDicomDumpApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getDicomDumpApi()).to.instanceOf(DicomDump);
    });

    it('should return getWorkflowApi', async function () {
      const jsXnat = new JsXnat(AUTH_METHODS.noAuth, '/');
      expect(jsXnat.getWorkflowApi()).to.instanceOf(Workflow);
    });
  });
});
