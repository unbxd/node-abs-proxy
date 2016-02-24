var httpProxy = require('http-proxy');

var AbsProxy = function (conf) {
  var protocol = conf.protocol ? conf.protocol : "http";
  var host = conf.host;
  var port = conf.port ? conf.port : "80";
  var writer = conf.onResponse;
  var url = protocol + "://" + host + ":" + port;

  this.proxy = httpProxy.createProxyServer({target: url});
  this.onWrite = function(data) {
    return typeof writer === 'function' ? writer.call(this, data) : data;
  }
};

AbsProxy.prototype = this.dispatcher = require('httpdispatcher');;
AbsProxy.prototype.constructor = AbsProxy;

AbsProxy.prototype.lesserGetListener = AbsProxy.prototype.getListener;
AbsProxy.prototype.getListener = function(url, type) {
  var listener = this.lesserGetListener(url, type);
  var proxy = this.proxy;
  var onWrite = this.onWrite;

  if (listener) {
    return listener;
  } else {
    return function(req, res) {
      var _write = res.write;
      var _writeHead = res.writeHead;
      var _end = res.end;
      var bufs = [];

      res.writeHead = function(code, headers) {
	res.removeHeader('Content-Length');

	if (headers) {
	  delete headers['content-length'];
	}
	_writeHead.apply(res, arguments);
      };

      res.write = function(data) {
	if(bufs.length === 0 || bufs.indexOf(data) !== -1) {
	  bufs.push(new Buffer(data));
	}
      };

      res.end = function() {
	var buf = Buffer.concat(bufs,
				bufs.reduce(function(prev, curr) {
				  return prev + curr.length;
				}, 0)
			       );
	var data = onWrite(buf.toString());
	_write.call(res, data);
	_end.apply(res, arguments);
      };

      proxy.web(req, res);
    };
  }
}

module.exports = AbsProxy;
