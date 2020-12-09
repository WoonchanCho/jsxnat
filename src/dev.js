//del
import fs from 'fs';

import debug from 'debug';
import { APP_NAME } from './Common/Constant';
import JsXnat from './index';
import PreArchive from './XnatDataMgmt/Prearchive';
const log = debug(`${APP_NAME}:test`);

(async () => {
  const jsXnat = new JsXnat('http://localhost:8081', 'admin', 'admin');
  // const jsXnat = new JsXnat(
  //   { username: 'woonchan', password: 'Whdnscks*6' },
  //   'https://cap.wustl.edu'
  // );
  const siteAdmin = jsXnat.getSiteAdmin();
  const siteConfigApi = siteAdmin.getSiteConfigApi();
  const preferenceApi = siteAdmin.getPreferenceApi();
  const schemaApi = siteAdmin.getDataTypeSchemaApi();

  const SystemAdmin = jsXnat.getSystemAdmin();
  // const archiveApi = SystemAdmin.getArchiveApi();
  const other = jsXnat.getOtherService();
  const fileMoverApi = other.getFileMoverApi();
  const emailApi = other.getEmailApi();
  const auditApi = other.getAuditApi();

  const dicomConfig = jsXnat.getDicomConfig();
  const anonymizationApi = dicomConfig.getAnonymizationApi();

  const userAuth = jsXnat.getUserAuth();
  const userAliasTokenApi = userAuth.getUserAliasTokenApi();
  const userAuthServiceApi = userAuth.getUserAuthServiceApi();

  const pluginAdmin = jsXnat.getPluginAdmin();
  const pluginApi = pluginAdmin.getPluginApi();

  const uiConfig = jsXnat.getUiConfig();
  const uiSpawnerApi = uiConfig.getUiSpawnerApi();
  const uiThemeApi = uiConfig.getUiThemeApi();

  const projectApi = jsXnat.getProjectApi();
  const subjectApi = jsXnat.getSubjectApi();
  const experimentApi = jsXnat.getExperimentApi();
  const scanApi = jsXnat.getScanApi();
  const imageAssessorApi = jsXnat.getImageAssessorApi();
  const resourceApi = jsXnat.getResouceApi();
  const archiveApi = jsXnat.getArchiveApi();
  const prearchiveApi = jsXnat.getPrearchiveApi();
  const searchApi = jsXnat.getSearchApi();
  const dataProcessingApi = jsXnat.getDataProcessingApi();
  const automationApi = jsXnat.getAutomationApi();
  const dicomDumpApi = jsXnat.getDicomDumpApi();
  const workflowApi = jsXnat.getWorkflowApi();
  try {
    // console.log(await schemaApi.getAllSchemas());
    // console.log(await schemaApi.getSchema('screeningAssessment', 'screening'));
    // // console.log(await schemaApi.setDataType({}));
    // console.log(await schemaApi.getAllDataTypeInfo());
    // // let res = await siteConfigApi.getSiteConfigValue('del');
    // // console.log(res);
    // console.log(await schemaApi.getDataTypeInfo('arc:ArchiveSpecification'));
    // console.log(await schemaApi.getDataTypeName('xnat:xcvSessionData'));
    // console.log(await schemaApi.getAllDataTypeNames());
    // console.log(
    //   await archiveApi.refreshCatalogWithSpecificOperation(
    //     ['All', 'Append'],
    //     '/archive/experiments/XNAT_E00001'
    //   )
    // );
    // log(
    //   await archiveApi.download({
    //     projectIds: ['18_nifiti'],
    //     sessions: ['18_nifiti:M00261317:M00261317_20080105161534:XNAT_E00001'],
    //     options: ['simplified'],
    //     scan_formats: ['DICOM'],
    //     scan_types: ['unknown'],
    //   })
    // );
    console.log(await projectApi.getProjects({}));
    // await projectApi.updateProject('del5', {
    //   _attrs: {
    //     ID: 'del5',
    //     secondary_ID: 'del55',
    //   },
    //   name: 'del55',
    //   description: 'desc55',
    //   keywords: 'keyword5, keyword55',
    //   aliases: {
    //     alias: ['alias5', 'alias55'],
    //   },
    //   PI: {
    //     title: 'analyst',
    //     firstName: 'first',
    //     lastName: 'last',
    //   },
    //   investigators: {
    //     investigator: [
    //       { title: 'second', firstName: 'second', lastName: 'second' },
    //     ],
    //   },
    // });
    // await projectApi.createSimpleProject('del5', 'del4', 'del4');
    // console.log(await projectApi.deleteProject('del4'));
    // console.log(await projectApi.setProjectAccessibility('del1', 'pRivate'));
    // console.log(await projectApi.getPrearchiveSetting('del1'));
    // console.log(await projectApi.setPrearchiveSetting('del1', '5'));
    // console.log(await projectApi.getQurantineCode('del1'));
    // console.log(await projectApi.setQurantineCode('del1', 4));
    // console.log(await projectApi.getScanTypes('del1', 'mrScanData'));
    // log(await projectApi.getAllInvestigators());
    // log(await projectApi.getInvestigator(4));
    // // await projectApi.createInvestigator({ firstname: 'aaa', lastname: 'bbb' });
    // await projectApi.updateInvestigator(4, {
    //   firstname: 'aaaa',
    //   lastname: 'bbbb',
    // });
    // log(await projectApi.deleteInvestigator(4));
    // log((await projectApi.getAssociatedUsers('del1')).ResultSet);
    // log(await projectApi.grantAccessToUser('del1', 'del1_owner', 'test'));
    // log(await projectApi.removeAccessFromUser('del1', 'del1_owner', 'test2'));
    // const res = await projectApi.getProjectAccessRequestforProject(
    //   'del1',
    //   'html'
    // );
    // log(res);
    // log(await projectApi.getConfigObjectForTool('del1', 'aaa', 'csv', true));
    // log(
    //   await projectApi.getDetailOfPipelineExecutionStep(
    //     'del1',
    //     'xml',
    //     'XNAT_E00001'
    //   )
    // );
    // res.ResultSet.Result.forEach((r) => {
    //   log(r);
    // });
    // await projectApi.acceptOrDeclineProjectAccessRequest('del1', 'accept');
    // log(await subjectApi.getAllSubjects(['age', 'dob', 'height'], 'csv'));
    // log(await subjectApi.getSubject('18_nifiti', 'XNAT_S00001', 'xml'));
    // log(await subjectApi.createSimpleSubject('del1', 'mylabel3'));
    // log(
    //   await subjectApi.createSubject('del1', 'mylabel3', {
    //     _attrs: {
    //       group: 'research',
    //       label: 'mylabel3',
    //       src: 'source',
    //     },
    //     demographics: {
    //       _attrs: {
    //         'xsi:type': 'demographicData',
    //       },
    //       dob: '1981-01-01',
    //       gender: 'male',
    //       handedness: 'right',
    //       education: 1,
    //       race: 'race',
    //       ethnicity: 'ethnicity',
    //       weight: 555,
    //       height: 666,
    //     },
    //   })
    // );
    // log(await subjectApi.getAllSubjects(['project', 'age'], 'csv'));
    // log(await subjectApi.getSubjects('del1', ['label'], 'csv'));
    // log(await subjectApi.getSubjectBySubjectLabel('del1', 'mylabel1', 'xml'));
    // log(
    //   await subjectApi.getSubjectBySubjectLabel('del1', 'XNAT2_S00004', 'xml')
    // );
    // log(await subjectApi.getSubjectBySubjectId('XNAT2_S00004', 'xml'));
    // log(await subjectApi.getSubject({ subjectId: 'XNAT2_S00004' }, 'xml'));
    // log(
    //   await subjectApi.updateSubjectBySubjectLabel('del1', 'mylabel1', {
    //     _attrs: {
    //       group: 'research',
    //       label: 'mylabel1',
    //       src: 'source',
    //     },
    //     demographics: {
    //       _attrs: {
    //         'xsi:type': 'demographicData',
    //       },
    //       dob: '1981-01-01',
    //       gender: 'male',
    //       handedness: 'right',
    //       education: 1,
    //       race: 'race',
    //       ethnicity: 'ethnicity',
    //       weight: 55522,
    //       height: 66611,
    //     },
    //   })
    // );
    // log(await subjectApi.shareSubject('del1', 'del2', 'mylabel2'));
    // log(await subjectApi.getSharedProjects('del1', 'mylabel1', 'csv'));
    // log(await subjectApi.deleteSubject('del2', 'newlabel2'));
    // log(
    //   await experimentApi.getAllExperiments(
    //     ['modality,UID,xsiType'],
    //     '11/01/1999',
    //     Date.now(),
    //     {
    //       UID: '1.2.840.113654.*',
    //       xsiType: 'xnat:crSessionData',
    //     },
    //     'csv'
    //   )
    // );
    // log(
    //   await experimentApi.getExperimentsInProject(
    //     '18_nifiti',
    //     ['modality,UID,xsiType'],
    //     '11/01/1999',
    //     Date.now(),
    //     {
    //       UID: '1.2.840.113654.*',
    //       xsiType: 'xnat:crSessionData',
    //     },
    //     'csv'
    //   )
    // );
    // log(
    //   await experimentApi.getExperiment(
    //     {
    //       projectId: '18_nifiti',
    //       subjectIdOrLabel: 'a',
    //       experimentId: 'XNAT_E00001',
    //     },
    //     ''
    //   )
    // );
    // log(await experimentApi.getExperimentByExperiment('XNAT_E00001'));
    // log(
    //   await experimentApi.getExperimentByExperimentLabel(
    //     '18_nifiti',
    //     'M00261317_200801051615341'
    //   )
    // );
    // log(
    //   await experimentApi.createExperiment('del1', 'mylabel1', 'experiment2', {
    //     xsiType: 'xnat:crSessionData',
    //     'xnat:experimentdata/date': '01/01/2018',
    //   })
    // );
    // log(
    //   await experimentApi.updateExperiment('del1', 'mylabel1', 'experiment2', {
    //     'xnat:experimentdata/date': '01/01/2019',
    //   })
    // );
    //     log(
    //       await experimentApi.updateExperimentWithRawXml(
    //         'del1',
    //         'mylabel1',
    //         'experiment2',
    //         `<xnat:CRSession xmlns:arc="http://nrg.wustl.edu/arc" xmlns:val="http://nrg.wustl.edu/val" xmlns:pipe="http://nrg.wustl.edu/pipe" xmlns:clara="http://nrg.wustl.edu/clara" xmlns:icr="http://icr.ac.uk/icr" xmlns:wrk="http://nrg.wustl.edu/workflow" xmlns:sets="http://nrg.wustl.edu/sets" xmlns:scr="http://nrg.wustl.edu/scr" xmlns:xdat="http://nrg.wustl.edu/security" xmlns:rad="http://nrg.wustl.edu/rad" xmlns:cat="http://nrg.wustl.edu/catalog" xmlns:prov="http://www.nbirn.net/prov" xmlns:xnat="http://nrg.wustl.edu/xnat" xmlns:xnat_a="http://nrg.wustl.edu/xnat_assessments" xmlns:imagelink="http://nrg.wustl.edu/imagelink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ID="XNAT2_E00002" project="del1" label="experiment2" xsi:schemaLocation="http://nrg.wustl.edu/workflow http://localhost:8081/schemas/workflow.xsd http://nrg.wustl.edu/catalog http://localhost:8081/schemas/catalog.xsd http://nrg.wustl.edu/pipe http://localhost:8081/schemas/repository.xsd http://nrg.wustl.edu/clara http://localhost:8081/schemas/clara.xsd http://nrg.wustl.edu/rad http://localhost:8081/schemas/mirrirRadRead.xsd http://nrg.wustl.edu/scr http://localhost:8081/schemas/screeningAssessment.xsd http://nrg.wustl.edu/sets http://localhost:8081/schemas/datasets.xsd http://nrg.wustl.edu/arc http://localhost:8081/schemas/project.xsd http://nrg.wustl.edu/imagelink http://localhost:8081/schemas/imagelink.xsd http://icr.ac.uk/icr http://localhost:8081/schemas/roi.xsd http://nrg.wustl.edu/xnat http://localhost:8081/schemas/xnat.xsd http://nrg.wustl.edu/val http://localhost:8081/schemas/protocolValidation.xsd http://nrg.wustl.edu/xnat_assessments http://localhost:8081/schemas/assessments.xsd http://www.nbirn.net/prov http://localhost:8081/schemas/birnprov.xsd http://nrg.wustl.edu/security http://localhost:8081/schemas/security.xsd">
    // <xnat:date>2020-01-01</xnat:date>
    // <xnat:subject_ID>XNAT2_S00004</xnat:subject_ID>
    // </xnat:CRSession>`
    //       )
    //     );
    // await subjectApi.shareSubject('del1', 'del3', 'mylabel1', 'mylabel11');
    // // await subjectApi.unshareSubject('del2', 'mylabel1');
    // log(
    //   await experimentApi.shareExperiment(
    //     'del1',
    //     'del3',
    //     'mylabel1',
    //     'experiment1'
    //   )
    // // );
    // log(
    //   await experimentApi.getSharedProjects(
    //     'del1',
    //     'mylabel1',
    //     'experiment1',
    //     'csv'
    //   )
    // );
    // log(
    //   await experimentApi.deleteExperiment('del3', 'mylabel11', 'experiment1')
    // );
    // log(
    //   await experimentApi.shareExperiment(
    //     'del1',
    //     'del3',
    //     'mylabel1',
    //     'experiment2'
    //   )
    // );
    // log(
    //   await experimentApi.getSharedProjects(
    //     'del1',
    //     'mylabel1',
    //     'experiment2',
    //     'csv'
    //   )
    // );
    // await experimentApi.deleteExperiment('del3', 'mylabel1', 'XNAT2_E00002');
    // log(await experimentApi.getScans({ experimentId: 'XNAT_E00001' }, 'csv'));
    // log(
    //   await experimentApi.getScanResources(
    //     {
    //       projectId: '18_nifiti',
    //       subjectIdOrLabel: 'M00261317',
    //       experimentLabel: 'XNAT_E00001',
    //     },
    //     1,
    //     'json'
    //   )
    // );
    // log(
    //   await experimentApi.addScan(
    //     'del1',
    //     'mylabel1',
    //     'experiment2',
    //     '2',
    //     'xnat:mrScanData',
    //     {
    //       'xnat:imageScanData/type': 'T11',
    //       note: 'note',
    //       series_description: 'desc',
    //       quality: 'qual',
    //     }
    //   )
    // );
    // log(
    //   await experimentApi.updateScan(
    //     'del1',
    //     'mylabel1',
    //     'experiment2',
    //     'aaa',
    //     'xnat:mrScanData',
    //     {
    //       'xnat:imageScanData/type': 'T12',
    //       note: 'note1',
    //       series_description: 'desc1222',
    //       quality: 'Usable',
    //     }
    //   )
    // );
    // await experimentApi.deleteScan('del1', 'mylabel1', 'experiment2', '2');
    // log(
    //   await imageAssessorApi.getAssessors(
    //     {
    //       projectId: 'del1',
    //       subjectIdOrLabel: 'mylabel1',
    //       experimentLabel: 'experiment2',
    //     },
    //     [''],
    //     undefined,
    //     undefined,
    //     undefined,
    //     'csv'
    //   )
    // );
    // log(
    //   await imageAssessorApi.getAssessor(
    //     {
    //       projectId: 'del1',
    //       subjectIdOrLabel: 'mylabel1',
    //       experimentLabel: 'experiment2',
    //       assessorId: 'XNAT2_E00006',
    //     },
    //     'xml'
    //   )
    // );
    // log(
    //   await imageAssessorApi.createAssessor(
    //     'del1',
    //     'mylabel1',
    //     'experiment2',
    //     '<crsessiondata label="assessor2"></crsessiondata>'
    //   )
    // );
    // log(
    //   await imageAssessorApi.updateAssessor(
    //     'del1',
    //     'mylabel1',
    //     'experiment2',
    //     'XNAT2_E00006',
    //     '<imageAssessorData></imageAssessorData>'
    //   )
    // );
    // await subjectApi.shareSubject('del1', 'del2', 'mylabel1', 'mylabel1');
    // log(
    //   await imageAssessorApi.shareAssessor(
    //     'del1',
    //     'del2',
    //     'mylabel1',
    //     'experiment2',
    //     'XNAT2_E00006'
    //   )
    // );
    // log(
    //   await imageAssessorApi.getSharedProjects(
    //     'del1',
    //     'mylabel1',
    //     'experiment2',
    //     'XNAT2_E00006',
    //     'csv'
    //   )
    // );
    // log(
    //   await imageAssessorApi.deleteAssessor(
    //     'del1',
    //     'mylabel1',
    //     'experiment2',
    //     'XNAT2_E00002'
    //   )
    // );
    // log(
    //   await subjectApi.createFolder(
    //     '18_nifiti',
    //     'XNAT_S00001',
    //     'test3',
    //     'format',
    //     'tag1',
    //     'content'
    //   )
    // );
    // log(
    //   await imageAssessorApi.getAssessors(
    //     {
    //       projectId: 'del1',
    //       subjectIdOrLabel: 'mylabel1',
    //       experimentLabel: 'experiment2',
    //     },
    //     [''],
    //     undefined,
    //     undefined,
    //     undefined,
    //     'csv'
    //   )
    // );
    // log(
    //   await imageAssessorApi.createFolder(
    //     '18_nifiti',
    //     'XNAT_S00001',
    //     'XNAT_E00001',
    //     'XNAT2_E00007',
    //     'test3',
    //     'format',
    //     'tag1',
    //     'content'
    //   )
    // );
    // log(
    //   await imageAssessorApi.getFolders(
    //     '18_nifiti',
    //     'XNAT_S00001',
    //     'XNAT_E00001',
    //     'XNAT2_E00007',
    //     undefined,
    //     'csv'
    //   )
    // );
    // log(
    //   await imageAssessorApi.uploadFile(
    //     '18_nifiti',
    //     'M00261317',
    //     'XNAT_E00001',
    //     'XNAT2_E00007',
    //     'test3',
    //     'test.txt',
    //     'aa333avbbbccc',
    //     true
    //   )
    // );
    // log(
    //   await imageAssessorApi.getFiles(
    //     '18_nifiti',
    //     'XNAT_S00001',
    //     'XNAT_E00001',
    //     'XNAT2_E00007',
    //     'file',
    //     'csv'
    //   )
    // );
    // log(
    //   await imageAssessorApi.getFile(
    //     '18_nifiti',
    //     'XNAT_S00001',
    //     'XNAT_E00001',
    //     'XNAT2_E00007',
    //     'test3',
    //     'test.txt'
    //   )
    // );
    // log(
    //   await imageAssessorApi.deleteFile(
    //     '18_nifiti',
    //     'M00261317',
    //     'XNAT_E00001',
    //     'XNAT2_E00007',
    //     'test3',
    //     'test.txt'
    //   )
    // );
    // log(
    //   await imageAssessorApi.deleteFolder(
    //     '18_nifiti',
    //     'M00261317',
    //     'M00261317_20080105161534',
    //     'XNAT2_E00007',
    //     'test3'
    //   )
    // );
    // const file = fs.readFileSync(
    //   '/Users/woonchan/Documents/sample/admin-20201015_140008.zip'
    // );
    // log(await archiveApi.uploadSession(file));
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<xdat:search ID="" allow-diff-columns="0" secure="false" brief-description="MR Sessions"
 xmlns:xdat="http://nrg.wustl.edu/security" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <xdat:root_element_name>xnat:mrSessionData</xdat:root_element_name>
    <xdat:search_field>
        <xdat:element_name>xnat:mrSessionData</xdat:element_name>
        <xdat:field_ID>LABEL</xdat:field_ID>
        <xdat:sequence>0</xdat:sequence>
        <xdat:type>string</xdat:type>
        <xdat:header>MR ID</xdat:header>
    </xdat:search_field>
    <xdat:search_field>
        <xdat:element_name>xnat:subjectData</xdat:element_name>
        <xdat:field_ID>LABEL</xdat:field_ID>
        <xdat:sequence>1</xdat:sequence>
        <xdat:type>string</xdat:type>
        <xdat:header>Subject</xdat:header>
    </xdat:search_field>
    <xdat:search_field>
        <xdat:element_name>xnat:mrSessionData</xdat:element_name>
        <xdat:field_ID>AGE</xdat:field_ID>
        <xdat:sequence>2</xdat:sequence>
        <xdat:type>integer</xdat:type>
        <xdat:header>Age</xdat:header>
    </xdat:search_field>
    <xdat:search_field>
        <xdat:element_name>cnda:clinicalAssessmentData</xdat:element_name>
        <xdat:field_ID>NEURO_CDR_RATING</xdat:field_ID>
        <xdat:sequence>3</xdat:sequence>
        <xdat:type>string</xdat:type>
        <xdat:header>CDR</xdat:header>
    </xdat:search_field>
    <xdat:search_field>
        <xdat:element_name>cnda:clinicalAssessmentData</xdat:element_name>
        <xdat:field_ID>NEURO_MMSE</xdat:field_ID>
        <xdat:sequence>4</xdat:sequence>
        <xdat:type>string</xdat:type>
        <xdat:header>MMSE</xdat:header>
    </xdat:search_field>
    <xdat:search_field>
        <xdat:element_name>xnat:subjectData</xdat:element_name>
        <xdat:field_ID>GENDER</xdat:field_ID>
        <xdat:type>string</xdat:type>
        <xdat:header>M/F</xdat:header>
    </xdat:search_field>
</xdat:search>`;
    // log(xml.length);
    // log(await searchApi.searchWithXml(xml, 'xml'));
    // log(await searchApi.getAvailableElements('csv'));
    // log(await searchApi.getQueriableFields('xnat:mrSessionData', 'csv'));
    // log(
    //   (await searchApi.getSearchReportVersionsFor('xnat:mrSessionData', 'json'))
    //     .DisplayVersions[0]
    // );
    // log(await searchApi.getStoredSearches('csv'));
    // log(await searchApi.getStoredSearch('xs1607151506341'));
    const xml2 = `<?xml version="1.0" encoding="UTF-8"?><xdat:bundle description="desc132323" brief-description="test21322" xmlns:arc="http://nrg.wustl.edu/arc" xmlns:cat="http://nrg.wustl.edu/catalog" xmlns:pipe="http://nrg.wustl.edu/pipe" xmlns:prov="http://www.nbirn.net/prov" xmlns:scr="http://nrg.wustl.edu/scr" xmlns:val="http://nrg.wustl.edu/val" xmlns:wrk="http://nrg.wustl.edu/workflow" xmlns:xdat="http://nrg.wustl.edu/security" xmlns:xnat="http://nrg.wustl.edu/xnat" xmlns:xnat_a="http://nrg.wustl.edu/xnat_assessments" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><xdat:root_element_name>xnat:mrSessionData</xdat:root_element_name><xdat:search_field>
<xdat:element_name>xnat:mrSessionData</xdat:element_name>
<xdat:field_ID>LABEL</xdat:field_ID>
<xdat:sequence>0</xdat:sequence>
<xdat:type>string</xdat:type>
<xdat:header>Label</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:mrSessionData</xdat:element_name>
<xdat:field_ID>PROJECT</xdat:field_ID>
<xdat:sequence>1</xdat:sequence>
<xdat:type>string</xdat:type>
<xdat:header>Project</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:mrSessionData</xdat:element_name>
<xdat:field_ID>DATE</xdat:field_ID>
<xdat:sequence>2</xdat:sequence>
<xdat:type>date</xdat:type>
<xdat:header>Date</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:subjectData</xdat:element_name>
<xdat:field_ID>SUBJECT_LABEL</xdat:field_ID>
<xdat:sequence>3</xdat:sequence>
<xdat:type>string</xdat:type>
<xdat:header>Subject</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:subjectData</xdat:element_name>
<xdat:field_ID>GENDER_TEXT</xdat:field_ID>
<xdat:sequence>4</xdat:sequence>
<xdat:type>string</xdat:type>
<xdat:header>M/F</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:mrSessionData</xdat:element_name>
<xdat:field_ID>AGE</xdat:field_ID>
<xdat:sequence>5</xdat:sequence>
<xdat:type>float</xdat:type>
<xdat:header>Age</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:mrSessionData</xdat:element_name>
<xdat:field_ID>TYPE</xdat:field_ID>
<xdat:sequence>6</xdat:sequence>
<xdat:type>string</xdat:type>
<xdat:header>Type</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:mrSessionData</xdat:element_name>
<xdat:field_ID>SCANNER</xdat:field_ID>
<xdat:sequence>7</xdat:sequence>
<xdat:type>string</xdat:type>
<xdat:header>Scanner</xdat:header></xdat:search_field><xdat:search_field>
<xdat:element_name>xnat:mrSessionData</xdat:element_name>
<xdat:field_ID>MR_SCAN_COUNT_AGG</xdat:field_ID>
<xdat:sequence>8</xdat:sequence>
<xdat:type>string</xdat:type>
<xdat:header>Scans</xdat:header></xdat:search_field></xdat:bundle>`;
    // log(await searchApi.updateStoredSearch('xs1607151506341', xml2));
    // log(await searchApi.getStoredSearchResult('xs1607149633066', true, 'xml'));
    // log(await dataProcessingApi.getPipelines('del1', 'xml'));
    // // log(await dataProcessingApi.getPipelineStep('del1', '2', '3'));
    // log(await automationApi.setAutomationProperties({ a: 1 }));
    // log(await automationApi.enableDisableAutomation(0));
    // log(await automationApi.getAllAutomationEventClasses());
    // log(await automationApi.getAutomationEventClasses('del1'));
    // log(await prearchiveApi.getAllSessions('csv'));
    // log((await prearchiveApi.getSessionsForProject('del1', 'json')).ResultSet);
    // log(
    //   await prearchiveApi.moveSessionToProject(
    //     '/prearchive/projects/del1/20201204_174201027/dcmtest1_MR1',
    //     'del2'
    //   )
    // );
    // log(
    //   await prearchiveApi.rebuildSession(
    //     '/prearchive/projects/del2/20201204_174201027/dcmtest1_MR1',
    //     'xml'
    //   )
    // );
    // log(
    //   await prearchiveApi.deleteSession(
    //     '/prearchive/projects/del2/20201204_174201027/dcmtest1_MR1'
    //   )
    // );
    // log(
    //   (
    //     await prearchiveApi.getScans(
    //       '/prearchive/projects/del1/20201204_174250041/M00261317_20080105161534',
    //       'json'
    //     )
    //   ).ResultSet
    // );
    // log(
    //   await prearchiveApi.deleteScan(
    //     '/prearchive/projects/del1/20201204_174250041/M00261317_20080105161534',
    //     1002,
    //     'csv'
    //   )
    // );
    // log(
    //   await prearchiveApi.getFolders(
    //     '/prearchive/projects/del1/20201204_174250041/M00261317_20080105161534',
    //     1001,
    //     undefined,
    //     'csv'
    //   )
    // );
    // log(
    //   await prearchiveApi.getFiles(
    //     '/prearchive/projects/del1/20201204_174250041/M00261317_20080105161534',
    //     1001,
    //     'DICOM',
    //     undefined,
    //     'csv'
    //   )
    // );

    // await prearchiveApi.getFile(
    //   '/prearchive/projects/del1/20201204_174250041/M00261317_20080105161534',
    //   1001,
    //   'DICOM',
    //   '1.2.840.113654.2.45.6248.59962007086951732585898259687074165250-1001-1001-9hkcrl.dcm'
    // );
    // log(await prearchiveApi.getPrearchiveSetting('del1'));
    // log(
    //   await prearchiveApi.getFiles(
    //     '/prearchive/projects/BC_1/20201205_182035742/bc1o2pk_mg0602_1',

    //   )
    // );
    // log(
    //   await prearchiveApi.getFolders(
    //     '/prearchive/projects/BC_1/20201205_182035742/bc1o2pk_mg0602_1',
    //     'csv'
    //   )
    // );
    // log(
    //   await dicomDumpApi.getDumpForPrearchiveSession(
    //     '/prearchive/projects/del1/20201204_174250041/M00261317_20080105161534/scans/1001',
    //     ['Modality', 'PatientID', 'PatientName', '00291020:RFEchoTrainLength'],
    //     'csv'
    //   )
    // );
    // log(
    //   await scanApi.getDicomDump(
    //     'del2',
    //     'M00261317',
    //     'M00261317_20080105161534',
    //     1,
    //     undefined,
    //     'csv'
    //   )
    // );
    // log(
    //   await prearchiveApi.archive(
    //     '/prearchive/projects/ohif-1/20201011_201015882/dcmtest1_MR1'
    //   )
    // );
    // log(
    //   await prearchiveApi.rebuildSession(
    //     '/prearchive/projects/ohif-1/20201011_201015882/dcmtest1_MR1',
    //     'xml'
    //   )
    // );
    // log(await projectApi.createSimpleProject('rest-2'));
    // log(
    //   (
    //     await prearchiveApi.moveSessionToProject(
    //       '/prearchive/projects/ohif-1/20201011_201015882/dcmtest1_MR1',
    //       'rest-1'
    //     )
    //   ).ResultSet
    // );
    // log(
    //   await prearchiveApi.archive(
    //     '/prearchive/projects/rest-1/20201205_211804531/dcmtest1_MR1',
    //     PreArchive.OverwriteOptions.delete
    //   )
    // );
    // log(
    //   await prearchiveApi.validateArchive(
    //     '/prearchive/projects/rest-1/20201205_214158940/dcmtest1_MR1',
    //     'xml'
    //   )
    // );

    // log(await jsXnat.getVersion(false));
    // log(await jsXnat.getVersion(false));
    // const file = fs.readFileSync('/Users/woonchan/Documents/sample/0002.DCM');
    // log(
    //   await archiveApi.uploadSession('0002.dcm', file, {
    //     dest: '/prearchive/projects/rest-1',
    //     PROJECT_ID: 'rest-1',
    //     'import-handler': 'SI',
    //   })
    // );
    // log(
    //   await fileMoverApi.moveFile(
    //     '/user/cache/resources/20201123_051609/files/del1.txt',
    //     '/archive/projects/ohif-1/resources/test/files'
    //   )
    // );
    // log(await emailApi.send('wcho24@wustl.edu1', 'subject', 'aaa', 'bbb'));
    // log(await auditApi.getAuditReport('xnat:mrSessionData', 'XNAT3_E00193'));
    // log(await emailApi.sendVerification('wcho24@wustl.edu'));
    // const script = `version "6.1"
    // project != "Unassigned" ? (0008,1030) := project
    // (0010,0010) := subject
    // (0010,0020) := session
    // - (0008,0081)`;
    // log(await anonymizationApi.getDefaultScript());
    // log(await anonymizationApi.getScript('ohif-1'));

    // log(await anonymizationApi.setScript('ohif-1', script));
    // log(await anonymizationApi.isScriptEnabled('ohif-1'));
    // log(await anonymizationApi.enableDisableScript('ohif-1', false));

    // log(await anonymizationApi.getSiteWideScript());
    // log(await anonymizationApi.isSiteWideScriptEnabled());
    // log(await anonymizationApi.enableDisableSiteWideScript(false));
    // log(await anonymizationApi.setSiteWideScript(script));

    // const file = fs.readFileSync('/Users/woonchan/Documents/sample/0002.DCM');
    // log(
    //   await archiveApi.uploadSession('0002.dcm', file, {
    //     // dest: '/prearchive/projects/rest-1',
    //     PROJECT_ID: 'rest-1',
    //     // overwrite: 'delete',
    //   })
    // );

    // const res = (await prearchiveApi.getAllSessions()).ResultSet.Result;
    // const conflicts = res.filter((item) => item.status === 'READY');
    // conflicts.forEach((item) => {
    //   log(item.url);
    // });
    // log(
    //   await prearchiveApi.archive(
    //     '/prearchive/projects/BC_1/20201206_010259962/bc1ngzj_mg5805_1',
    //     PreArchive.OverwriteOptions.delete
    //   )
    // );

    // for (let i = 0; i < 1; ++i) {
    //   const arc = conflicts[i];
    //   log('archving', arc.url);
    //   log(
    //     await prearchiveApi.archive(arc.url, PreArchive.OverwriteOptions.delete)
    //   );
    // }
    // const xml3 = `<wrk:Workflow xmlns:wrk="http://nrg.wustl.edu/workflow"
    //  ExternalID="PipelineTest"
    //  ID="XNAT3_E00192"
    //  data_type="xnat:mrSessionData"
    //  launch_time="2014-02-13T00:50:54"
    //  pipeline_name="My_Pipeline_Name"
    //  status="In Progress" />`;
    // log(await workflowApi.createWorkflowWithRawXml(xml3));
    // log(await workflowApi.updateWorkflowStatus());
    // log(
    //   await workflowApi.getWorkflow({
    //     'wrk:workflowData/id': 'XNAT3_E00192',
    //     'wrk:workflowData/pipeline_name': 'My_Pipeline_Name',
    //   })
    // );
    // log(await workflowApi.getWorkflowById(1700, 'xml'));
    // log(await workflowApi.updateWorkflowStatus(1702, 'Complete'));
    // log(await userAliasTokenApi.issueToken());
    // log(
    //   await userAliasTokenApi.validateToken(
    //     '0f50a2b3-e59d-4f98-957d-4a66342278ca',
    //     'TTmuqhwVZPcMUElUTcoiVRoHU8x6XOurpsbOk2BdbPFdEvgMVOsY3h5K1soIvz36'
    //   )
    // );
    // await jsXnat.refreshToken();
    // const plugins = await pluginApi.getInstalledPlugins();
    // Object.keys(plugins).forEach((key) => {
    //   log(plugins[key]);
    // });
    // log(await pluginApi.getOpenUrlSettings());
    // log(
    //   await pluginApi.setOpenUrlSettings({
    //     '/*.js': false,
    //   })
    // );

    // log(await pluginApi.getInstalledPlugins());
    // log(jsXnat);

    // log(await uiSpawnerApi.getElementNamespaces());
    // log(await uiSpawnerApi.getElementIdsInNamespace());
    log(await userAuthServiceApi.authenticate());
  } catch (err) {
    console.log(err);
  }
})();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
