# JsXnat

`JsXnat` provides a higher-level JavaScript wrapper around XNAT's rest API.

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
import JsXnat from 'jsxnat';

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

### CORS
To use the JsXnat in the client side (e.g., browser), you should configure your XNAT tomcat sevrer and Spring Security to allow your XNAT to support the Cross Origin Resource Request (CORS).

## License

MIT