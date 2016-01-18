var httpProxy = require('http-proxy');

var AbsProxy = function (conf) {
  var protocol = conf.protocol ? conf.protocol : "http";
  var host = conf.host;
  var port = conf.port ? conf.port : "80";
  var url = protocol + "://" + host + ":" + port;
  console.log("URL: " + url);
  this.proxy = httpProxy.createProxyServer({target: url});

  console.log(this.proxy);
};

AbsProxy.prototype = this.dispatcher = require('httpdispatcher');;
AbsProxy.prototype.constructor = AbsProxy;

AbsProxy.prototype.lesserGetListener = AbsProxy.prototype.getListener;
AbsProxy.prototype.getListener = function(url, type) {
  var listener = this.lesserGetListener(url, type);
  var proxy = this.proxy;

  if (listener) {
    console.log("returning the listener: " + listener);

    return listener;
  } else {
    console
      .log("no handler defined. passing the call through to remote server");

    return function(req, res) {
      proxy.web(req, res);
    };
  }
}

module.exports = AbsProxy;
