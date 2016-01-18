# abs-proxy
HTTP proxying with ability to override existing routes or define new routes.

### Usage
##### Require & instantiate
```javascript
var absProxy = require('abs-proxy');

var proxy = absProxy.createAbsProxy({host: 'httpbin.org', port: 80});
```

##### As a proxy
Lets create a reverse proxy to [httpbin](https://httpbin.org/):

```javascript
var http = require('http');
http.createServer(function(req, res) {
  proxy.dispatch(req, res);
}).listen(8080, 'localhost');
```

Note that default value for `port` is 80 and can be skipped from being included in the parameter hash for `Proxy`.

##### Override an existing path
###### GET
```javascript
proxy.onGet('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, world!\n');
});

var http = require('http');
http.createServer(function(req, res) {
    proxy.dispatch(req, res);
}).listen(8080, 'localhost');
```

###### POST
```javascript
proxy.onPost('/post', function(req, res) {
    res.writeHead(201, {'Content-Type': 'text/plain'});
    res.end('You just posted!\n');
});

var http = require('http');
http.createServer(function(req, res) {
    proxy.dispatch(req, res);
}).listen(8080, 'localhost');
```

##### Implement a new path
###### GET
```javascript
proxy.onGet('/non-existant-path', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, world!\n');
});

var http = require('http');
http.createServer(function(req, res) {
    proxy.dispatch(req, res);
}).listen(8080, 'localhost');
```

###### POST
```javascript
proxy.onPost('/non-existant-path', function(req, res) {
    res.writeHead(201, {'Content-Type': 'text/plain'});
    res.end('You just posted!\n');
});

var http = require('http');
http.createServer(function(req, res) {
    proxy.dispatch(req, res);
}).listen(8080, 'localhost');
```
