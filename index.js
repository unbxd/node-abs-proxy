var AbsProxy = require('./lib/abs-proxy.js');
module.exports.createAbsProxy = function(options) {
    return new AbsProxy(options);
};