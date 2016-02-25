var httpProxy = require('http-proxy');

var AbsProxy = function (conf) {
  var protocol = conf.protocol ? conf.protocol : "http";
  var host = conf.host;
  var port = conf.port ? conf.port : "80";
  var writer = conf.onResponse;
  var url = protocol + "://" + host + ":" + port;

  this.proxy = httpProxy.createProxyServer({target: url});
};

AbsProxy.prototype = this.dispatcher = require('httpdispatcher');
AbsProxy.prototype.constructor = AbsProxy;
AbsProxy.prototype.listeners['proxy'] = [];

AbsProxy.prototype.onResponse = function(url, cb) {
  this.on('proxy', url, cb);
};

AbsProxy.prototype.getProxyListener = function(url, method) {
  for(var i = 0, listener; i<this.listeners[method].length; i++) {
    listener = this.listeners[method][i];
    if(this.urlMatches(listener.url, url)) return listener.cb;
  }
};

AbsProxy.prototype.overrideResponseMethods = function(req, res, listenerCb) {
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
    bufs.push(new Buffer(data));
  };

  res.end = function() {
    var buf = Buffer.concat(bufs,
			    bufs.reduce(function(prev, curr) {
			      return prev + curr.length;
			    }, 0)
			   );
    var data = new Buffer(listenerCb(buf.toString()));
    _write.call(res, data);
    _end.apply(res, arguments);
  };

  return res;
};

AbsProxy.prototype.lesserGetListener = AbsProxy.prototype.getListener;
AbsProxy.prototype.getListener = function(url, type) {
  var listener = this.lesserGetListener(url, type);
  var proxy = this.proxy;
  var onWrite = this.onWrite;
  var overrideResponseMethods = this.overrideResponseMethods;

  if (listener) {
    return listener;
  } else {
    listener = this.getProxyListener(url, 'proxy');
    return function(req, res) {
      if(listener) {
	res = overrideResponseMethods(req, res, listener);
      }

      proxy.web(req, res);
    };
  }
};

module.exports = AbsProxy;
