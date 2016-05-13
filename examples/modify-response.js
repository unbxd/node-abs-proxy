var absProxy = require('../index');
var proxy = absProxy.createAbsProxy({
    host: 'httpbin.org',
    port: 80
});

proxy.onResponse(/\//, function() {
    return 'ok';
});

var http = require('http');

http.createServer(function(req, res) {
    proxy.dispatch(req, res);
}).listen(8080, 'localhost');
