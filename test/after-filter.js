var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var absProxy = require('../index');
var server;
var proxy;

describe('With http://httpbin.org, apply after filter', function() {
    describe('GET /', function() {
        var TEST_MESSAGE = 'test message';
	var AFTER_FILTER_MESSAGE = 'after filter message';
        var options = {
            url: 'http://localhost:8080',
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        before(function() {
            proxy = absProxy
                .createAbsProxy({host: 'httpbin.org', port: 80});

	    proxy.afterFilter(/\//, function(req, res, chain) {
		TEST_MESSAGE = AFTER_FILTER_MESSAGE;
		chain.next(req, res);
	    });
	    
            proxy.onGet('/', function(req, res) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(TEST_MESSAGE);
            });

            server = http.createServer(function(req, res) {
                proxy.dispatch(req, res);
            }).listen(8080, 'localhost');
        });

        after(function() {
            server.close();
            proxy.listeners.get = [];
        });

        it('should return 200', function(done) {
            this.timeout(5000);

            request.get(options, function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('should contain the body applied on beforeFilter', function(done) {
            this.timeout(5000);

            request.get(options, function(err, res, body) {
                expect(body).to.equal(AFTER_FILTER_MESSAGE);
                done();
            });
        });
    });
});
