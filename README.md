# JsXnat

`JsXnat` provides a higher-level JavaScript wrapper around XNAT's rest API.
This library tries to be isomporphic, so most of the functionality works in both Node.js and Broswer environments.


## Install
JsXnat is available from npm or unpkg.
```javascript
npm install jsxnat
```
```javascript
yarn add jsxnat
```
```html
<script src="https://unpkg.com/jsxnat/dist/web/jsxnat.umd.js"></script>
```

## API Documentation
[API documentation](https://woonchancho.github.io/jsxnat/) is hosted on github pages, and is generated from JSDoc

## Usage

### Authentication Method
There are 3 authentication methods available.
1. noAuth
This is used when the web app that uses this library is packaged into the XNAT plugin and it is launched in the same context of the XNAT node that it points to. In this case, seprate authentication is not needed.
e.g., new JsXnat('noAuth', '/');
2. password
Username and password provided is used for the XNAT authentication. Each XNAT Rest API call is independent and run in the different session.
e.g., new JsXnat('password', 'http://localhost:8080', { username: 'username', password: 'password' });
3. token
Username and password provided is used for the XNAT authentication. Before the first XNAT method call, an alias token is created and this will be used in every subsequent XNAT rest API call. The token creation and recreation after expiration is internally managed.
e.g., new JsXnat('token', 'http://localhost:8080', { username: 'username', password: 'password' });

### Output
The output format of XNAT rest API call (via corresponding wrapper class method) is JSON by default.
```javascript
...
const projectApi = jsXnat.getProjectApi();
      projectApi
        .getProjects()
        .then((res) => {
          console.log(res.ResultSet.Result);
        })
```
[
  {
    pi_firstname: '',
    secondary_ID: 'Subj_001',
    pi_lastname: '',
    name: 'Sample Project',
    description: '',
    ID: 'Subj_001',
    URI: '/data/projects/Subj_001'
  },
  ...
]

### Import

#### Node.js with the CommonJS module system
```javascript
const JsXnat = require('jsxnat');
```

#### Node.js with the ES6 module system
```javascript
import JsXnat from 'jsxnat';
```


#### Browser or Electron with the ES6 module system (with a build tool)
```javascript
import JsXnat from 'jsxnat/web/jsxnat.js';
```

### Browser or Electron with HTML
```html
<script src="https://unpkg.com/jsxnat@0.0.1/dist/web/jsxnat.umd.js"></script>
```

### Sample Usage
```javascript
var jsXnat = new JsXnat('password', 'http://localhost:8080', { username: 'username', password: 'password' });
const projectApi = jsXnat.getProjectApi();
projectApi.getProjects().then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
```

### Library Structure
JsXnat is the main class for accessing all the sub classes and the API methods in them.
There are more than 200 APIs defined in the XNAT, so I created the following sub structure for you to easily navigate the APIs you want. The stucture almost resembles the structure of [XNAT REST API Directory] (https://wiki.xnat.org/display/XAPI/XNAT+REST+API+Directory) but there are some difference.

Some REST APIs have mutiple methods defined in the differnt sub-classes for users to easily find them.)

There are three categories: XNAT Administration, XNAT Data Management, Plugins
1. XNAT Administration
    - APIS for XNAT administrators
    - two level object should be retrieved to use a method.
    e.g., Take a getSiteWideConfig as an example.
    ```javascript
    const jsXnat = new JsXnat(...);
    const siteAdmin = jsXnat.getSiteAdmin();
    const siteConfigApi = siteAdmin.getSiteConfigApi();
    siteConfigApi.getSiteConfig()
    ```

2. XNAT Data Management
    - APIs for Data Management (Projects, Subject, Experiment, Scans, etc.)
    - Just one level object should be retirieved to use a method
    e.g., Take a getExperimentsInProject as an example.
    ```javascript
    const jsXnat = new JsXnat(...);
    const experimentApi = jsXnat.getExperimentApi();
    experimentApi.getExperimentsInProject(projectId);
    ```

3. Plugins (To be added in the future)
    - APIs for 3rd party plugins

```bash
└── JsXnat
    ├── XnatAdmin
    │   ├── SiteAdmin
    │   │   ├── SiteWideConfig (jsXnat.getSiteAdmin().getSiteConfigApi())
    │   │   ├── Preference
    │   │   └── DataTypeSchema
    │   ├── SystemAdmin
    │   │   ├── Archive
    │   │   ├── Notification
    │   │   └── Task
    │   ├── UserAdmin
    │   │   ├── UserMgmt (TBD)
    │   │   ├── UserResource (TBD)
    │   │   ├── ProjectUserAccess (TBD)
    │   │   └── ProjectAccessRequest (TBD)
    │   ├── UserAuth
    │   │   ├── UserSessionMgmt (TBD)
    │   │   ├── UserAuthService
    │   │   └── UserAliasToken
    │   ├── PluginAdmin
    │   │   └── Plugin
    │   ├── UiConfig
    │   │   ├── UiSpawner
    │   │   ├── UiTheme
    │   ├── DicomConfig
    │   │   ├── DicomScp
    │   │   └── Anonymization
    │   └── OtherService
    │   │   ├── FileMover
    │   │   ├── Email
    │   │   ├── Audit
    │   │   └── CatalogRefresh
    ├── XnatDataMgmt
    │   ├── Project (jsXnat.getProjectApi())
    │   ├── Subject (jsXnat.getSubjectApi())
    │   ├── Experiment (jsXnat.getExperimentApi())
    │   ├── Scan (jsXnat.getProjectApi())
    │   ├── ImageAssessor (jsXnat.ImageAssessorApi())
    │   ├── Resource
    │   ├── Archive
    │   ├── Search
    │   ├── DataProcessing
    │   ├── Automation
    │   ├── Prearchive
    │   └── Workflow
    └──  Plugins

```

### User Alias Token


### CORS
To use the JsXnat in the client side (e.g., browser), you should configure your XNAT tomcat sevrer and Spring Security to allow your XNAT to support the Cross Origin Resource Request (CORS).

## License

MIT