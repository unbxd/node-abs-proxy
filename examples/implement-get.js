var absProxy = require('../index');
var proxy = absProxy.createAbsProxy({host: 'httpbin.org', port: 80})

proxy.onGet('/non-existent-path', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, you did a GET at ' + req.url + '!\n');
});

var http = require('http');
http.createServer(function(req, res) {
    proxy.dispatch(req, res);
}).listen(8080, 'localhost');