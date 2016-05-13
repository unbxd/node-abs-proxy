var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var absProxy = require('../index');
var server;
var proxy;

describe('With http://httpbin.org, modify response from proxy', function() {
    describe('GET /', function() {
	var options = {
	    url: 'http://localhost:8080/get?q=unmodified',
	    headers: {
		'Content-Type': 'text/plain'
	    }
	};
	before(function() {
	    proxy = absProxy
		.createAbsProxy({
		    host: 'httpbin.org',
		    port: 80
		});

	    proxy.onResponse(/\//, function(data) {
		return data.toString().replace('unmodified', 'modified');
	    });

	    server = http.createServer(function(req, res) {
		proxy.dispatch(req, res);
	    }).listen(8080, 'localhost');
	});

	after(function() {
	    server.close();
	    proxy.listeners.proxy = [];
	});

	it('should return 200', function(done) {
	    this.timeout(5000);

	    request.get(options, function(err, res) {
		expect(res.statusCode).to.equal(200);
		done();
	    });
	});

	it('should contain the modified response', function(done) {
	    this.timeout(5000);

	    request.get(options, function(err, res, body) {
		body = JSON.parse(body);
		expect(body.args.q).to.equal('modified');
		done();
	    });
	});

	it('should be able to parse gzipped response', function(done) {
	    this.timeout(5000);
	    options.url = 'http://localhost:8080/gzip';

	    request.get(options, function(err, res, body) {
		body = JSON.parse(body);
		expect(body.gzipped).to.equal(true);
		done();
	    });
	});
    });
});
