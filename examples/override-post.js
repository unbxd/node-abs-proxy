var absProxy = require('../index');
var proxy = absProxy.createAbsProxy({host: 'httpbin.org', port: 80})

proxy.onPost('/post', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('You just posted!\n');
});

var http = require('http');
http.createServer(function(req, res) {
    proxy.dispatch(req, res);
}).listen(8080, 'localhost');
