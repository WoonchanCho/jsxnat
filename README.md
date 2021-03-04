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

### Import

#### Node.js with the CommonJS module system
```javascript
const JsXnat = require('jsxnat');

var jsXnat = new JsXnat('http://localhost:8080', 'username', 'password');
const projectApi = jsXnat.getProjectApi();
projectApi.getProjects().then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
```

#### Node.js with the ES6 module system
```javascript
import JsXnat from 'jsxnat';

var jsXnat = new JsXnat('http://localhost:8080', 'username', 'password');
const projectApi = jsXnat.getProjectApi();
projectApi.getProjects().then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
```

#### Browser or Electron with the ES6 module system (with a build tool)
```javascript
import JsXnat from 'jsxnat/web/jsxnat.js';

var jsXnat = new JsXnat('http://localhost:8080', 'username', 'password');
const projectApi = jsXnat.getProjectApi();
projectApi.getProjects().then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
```

### Browser or Electron with HTML
```html
<script src="https://unpkg.com/jsxnat@0.0.1/dist/web/jsxnat.umd.js"></script>
<script>
  var jsXnat = new JsXnat('http://localhost:8080', 'username', 'password');
  const projectApi = jsXnat.getProjectApi();
  projectApi.getProjects().then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });
</script>
```

### Library Structure
JsXnat is the main class for accessing all the sub classes and the API methods in them.
There are more than 200 APIs defined in the XNAT, so I created the following sub structure for you to easily navigate the APIs you want. The stucture almost resembles the structure of [XNAT REST API Directory] (https://wiki.xnat.org/display/XAPI/XNAT+REST+API+Directory) but there are some difference.

Some REST APIs have mutiple methods defined in the differnt sub-classes for users to easily find them.)

There are three categories: XNAT Administration, XNAT Data Management, Plugins
1. XNAT Administration
    - APIS for XNAT administrators
    - 
2. XNAT Data Management
    - APIs for Data Management (Projects, Subject, Experiment, Scans, etc.)
3. Plugins (To be added in the future)
    - APIs for 3rd party plugins

```bash
└── JsXnat
    ├── XnatAdmin
    │   ├── SiteAdmin
    │   │   ├── SiteWideConfig
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
    │   ├── Project
    │   ├── Subject
    │   ├── Experiment
    │   ├── Scan
    │   ├── ImageAssessor
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